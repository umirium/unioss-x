import Box from "@mui/material/Box";
import type { SlideProps } from "@mui/material";
import { IconButton, Slide, Snackbar, ThemeProvider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Outline from "~/components/outline";
import { useDarkThemeContext } from "~/providers/darkThemeProvider";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import {
  destroySession as destroyAuthSession,
  getSession as getAuthSession,
} from "~/utils/sessions/auth.server";
import { getSession as getCartSession } from "~/utils/sessions/cart.server";
import {
  commitSession as commitNoticeSession,
  getSession as getNoticeSession,
} from "~/utils/sessions/notice.server";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type TransitionProps = Omit<SlideProps, "direction">;

const TransitionUp = (props: TransitionProps) => (
  <Slide {...props} direction="up" />
);

export const loader = async ({ request }: LoaderArgs) => {
  const authUser = await authenticator.isAuthenticated(request);
  const cartSession = await getCartSession(request.headers.get("Cookie"));
  const noticeSession = await getNoticeSession(request.headers.get("Cookie"));

  return json(
    {
      authUser,
      cart: cartSession.get("cart"),
      notice: noticeSession.get("notice"),
    },
    {
      headers: {
        "Set-Cookie": await commitNoticeSession(noticeSession),
      },
    }
  );
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  // sign-out process from outline
  if (formData.get("signout")) {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));

    // to show snackbar of successful sign-out
    const noticeSession = await getNoticeSession(request.headers.get("cookie"));
    noticeSession.flash("notice", "signout");

    // manually destroy auth session because headers can't be send to redirect on logout of remix-auth
    //
    // TODO: If this feature is added to logout of remix-auth, use this following code.
    // // await authenticator.logout(request, {
    // //   redirectTo: `/front/signin${redirectTo && `?r=${redirectTo}`}`,
    // // });

    const redirectTo = formData.get("redirectTo");
    const authSession = await getAuthSession(request.headers.get("Cookie"));

    const headers = new Headers();
    headers.append("Set-Cookie", await destroyAuthSession(authSession));
    headers.append("Set-Cookie", await commitNoticeSession(noticeSession));

    return redirect(`/front/signin${redirectTo && `?r=${redirectTo}`}`, {
      headers,
    });
  }

  return null;
};

export default function Front() {
  const { authUser, cart, notice } = useLoaderData<typeof loader>();
  const { theme } = useDarkThemeContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [transition, setTransition] = useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    setTransition(() => TransitionUp);
    setOpenSnackbar(!!notice);
  }, [notice]);

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event) => {
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Outline authUser={authUser} cart={cart}>
        <Box>
          <Outlet />
        </Box>
      </Outline>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openSnackbar}
        TransitionComponent={transition}
        onClose={handleCloseSnackbar}
        // NOTE: If possibility of same data is sent, timestamp shall be given.
        message={notice ? t(`notice:${notice.split("_")[0]}`) : ""}
        autoHideDuration={5000}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </ThemeProvider>
  );
}

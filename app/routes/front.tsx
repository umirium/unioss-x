import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SlideProps } from "@mui/material";
import {
  Button,
  IconButton,
  Slide,
  Snackbar,
  ThemeProvider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Outline from "~/components/outline";
import { useDarkThemeContext } from "~/providers/darkThemeProvider";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import {
  destroySession as destroyAuthSession,
  getSession as getAuthSession,
} from "~/utils/sessions/auth.server";
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

  const session = await getNoticeSession(request.headers.get("Cookie"));
  const flash = session.get("notice");

  let notice: string | undefined =
    ["signin", "signout"].includes(flash) && flash;

  return json(
    { authUser, notice },
    {
      headers: {
        "Set-Cookie": await commitNoticeSession(session),
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
  const { authUser, notice } = useLoaderData<typeof loader>();
  const { theme } = useDarkThemeContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [transition, setTransition] = useState<
    React.ComponentType<TransitionProps> | undefined
  >(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    setTransition(() => TransitionUp);
    setOpenSnackbar(notice ? !!notice : false);
  }, [notice]);

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event) => {
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Outline authUser={authUser}>
        <Box>
          <Outlet />

          <Box sx={{ mt: 10 }}>
            <Button variant="text">Text</Button>
            <Button variant="contained">Contained</Button>
            <Button variant="outlined">Outlined</Button>
          </Box>

          <Typography sx={{ paddingTop: "1em" }}>
            {[...new Array(10)]
              .map(
                () => `
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
                  dolor purus non enim praesent elementum facilisis leo vel. Risus at
                  ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
                  quisque non tellus. Convallis convallis tellus id interdum velit
                  laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
                  adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
                  integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
                  eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
                  quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
                  vivamus at augue. At augue eget arcu dictum varius duis at consectetur
                  lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
                  faucibus et molestie ac.

                  Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
                  ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
                  elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse
                  sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat
                  mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis
                  risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas
                  purus viverra accumsan in. In hendrerit gravida rutrum quisque non
                  tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
                  morbi tristique senectus et. Adipiscing elit duis tristique
                  sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                  eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                  posuere sollicitudin aliquam ultrices sagittis orci a.
                `
              )
              .join("\n")}
          </Typography>
        </Box>
      </Outline>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openSnackbar}
        TransitionComponent={transition}
        onClose={handleCloseSnackbar}
        message={t(`notice:${notice}`)}
        autoHideDuration={5000}
        action={
          <IconButton
            size="small"
            aria-label="close"
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

import type { SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import Outline from "~/components/outline";
import { useDarkThemeContext } from "~/providers/darkThemeProvider";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import {
  destroySession as destroyAuthSession,
  getSession as getAuthSession,
} from "~/utils/sessions/auth.server";
import {
  destroySession as destroyCartSession,
  getSession as getCartSession,
} from "~/utils/sessions/cart.server";
import {
  commitSession as commitNoticeSession,
  getSession as getNoticeSession,
} from "~/utils/sessions/notice.server";
import type { definitions } from "~/types/tables";
import type { SnakeToCamel } from "snake-camel-types";
import type { NoticeType } from "~/types/outline";
import MyNotice from "~/components/atoms/MyNotice";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: data.siteTitle,
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const authUser = await authenticator.isAuthenticated(request);
  const cartSession = await getCartSession(request.headers.get("Cookie"));
  const noticeSession = await getNoticeSession(request.headers.get("Cookie"));

  const cart: Array<SnakeToCamel<definitions["carts"]>> =
    cartSession.get("cart") || [];
  const notice: NoticeType = noticeSession.get("notice");

  // site title
  const siteTitle = "UNIOSS-X";

  return json(
    { authUser, cart, notice, siteTitle },
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

    // show snackbar of successful sign-out
    const noticeSession = await getNoticeSession(request.headers.get("cookie"));
    noticeSession.flash("notice", { key: "signout" });

    // manually destroy auth session because headers can't be send to redirect on logout of remix-auth
    //
    // TODO: If this feature is added to logout of remix-auth, use this following code.
    // // await authenticator.logout(request, {
    // //   redirectTo: `/front/signin${redirectTo && `?r=${redirectTo}`}`,
    // // });

    const redirectTo = formData.get("redirectTo");
    const authSession = await getAuthSession(request.headers.get("Cookie"));

    const cartSession = await getCartSession(request.headers.get("Cookie"));

    const headers = new Headers();
    headers.append("Set-Cookie", await commitNoticeSession(noticeSession));
    headers.append("Set-Cookie", await destroyAuthSession(authSession));
    headers.append("Set-Cookie", await destroyCartSession(cartSession));

    return redirect(`/front/signin${redirectTo && `?r=${redirectTo}`}`, {
      headers,
    });
  }

  return null;
};

export default function Front() {
  const { authUser, cart, notice } = useLoaderData<typeof loader>();
  const { theme } = useDarkThemeContext();
  const [openNotice, setOpenNotice] = useState(false);

  useEffect(() => {
    setOpenNotice(!!notice);
  }, [notice]);

  const handleCloseSnackbar = (event: SyntheticEvent | Event) => {
    setOpenNotice(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Outline authUser={authUser} cart={cart}>
        <Box>
          <Outlet />
        </Box>
      </Outline>

      {/* show Snackbar */}
      <MyNotice
        open={openNotice}
        onClose={handleCloseSnackbar}
        i18nObj={notice}
      />
    </ThemeProvider>
  );
}

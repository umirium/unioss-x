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
  commitSession as commitAlertSession,
  getSession as getAlertSession,
} from "~/utils/sessions/alert.server";
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
import {
  commitSession as commitSettingsSession,
  getSession as getSettingsSession,
} from "~/utils/sessions/settings.server";
import type { definitions } from "~/types/tables";
import type { SnakeToCamel } from "snake-camel-types";
import type { NoticeType, SettingsType } from "~/types/outline";
import MyNotice from "~/components/atoms/MyNotice";
import snakecaseKeys from "snakecase-keys";
import { db } from "~/utils/db.server";
import {
  MODE_DARK,
  MODE_LIGHT,
  MODE_SYSTEM,
} from "~/utils/constants/index.server";

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

  // site settings
  const settingsSession = await getSettingsSession(
    request.headers.get("Cookie")
  );
  const settings: SettingsType = settingsSession.get("settings");

  // NOTE: Be sure to commit notice session because it will pop up permanently.
  return json(
    { authUser, cart, notice, siteTitle, settings },
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

  // change of darkmode or language from settingsDrawer
  if (formData.get("darkMode") || formData.get("language")) {
    const settingsSession = await getSettingsSession(
      request.headers.get("Cookie")
    );

    const settings: SettingsType = settingsSession.get("settings");

    const darkMode = formData.get("darkMode") || settings.darkMode;
    const language = formData.get("language") || settings.language;

    settings.darkMode =
      darkMode === "light" || darkMode === "dark" ? darkMode : "system";
    settings.language =
      language === "en" || language === "ja" ? language : "en";

    settingsSession.set("settings", settings);

    const headers = new Headers();
    headers.append("Set-Cookie", await commitSettingsSession(settingsSession));

    // if singed-in, write settings data to database.
    const authUser = await authenticator.isAuthenticated(request);

    if (authUser) {
      // insert settings data to database
      try {
        const { error } = await db
          .from<definitions["settings"]>("settings")
          .update(
            snakecaseKeys({
              darkMode:
                settings.darkMode === "light"
                  ? MODE_LIGHT
                  : settings.darkMode === "dark"
                  ? MODE_DARK
                  : MODE_SYSTEM,
              language: settings.language,
            })
          )
          .eq("user_id", authUser.id)
          .eq("delete_flg", false);

        if (error) {
          console.log(error);
          throw new Error("update");
        }
      } catch (error: Error | unknown) {
        // show alert of database errors
        const alertSession = await getAlertSession(
          request.headers.get("cookie")
        );

        if (error instanceof Error) {
          alertSession.flash("alert", {
            key: `dbErrors_${Date.now()}`,
            options: { error: `common:${error.message}` },
          });
        } else {
          alertSession.flash("alert", {
            key: `unknown_${Date.now()}`,
          });
        }

        headers.append("Set-Cookie", await commitAlertSession(alertSession));

        return redirect(formData.get("redirectTo") as string, {
          headers,
        });
      }
    }

    return redirect(formData.get("redirectTo") as string, {
      headers,
    });
  }

  return null;
};

export default function Front() {
  const { authUser, cart, notice, settings } = useLoaderData<typeof loader>();
  const { theme, setMode } = useDarkThemeContext();
  const [openNotice, setOpenNotice] = useState(false);

  useEffect(() => {
    setMode(settings.darkMode || "system");
  }, [setMode, settings.darkMode]);

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

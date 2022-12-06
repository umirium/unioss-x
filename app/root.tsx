import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import {
  commitSession as commitSettingsSession,
  getSession as getSettingsSession,
} from "~/utils/sessions/settings.server";
import styles from "~/styles/root.css";
import { useChangeLanguage } from "remix-i18next";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import i18n from "./i18n";
import type { SettingsType } from "./types/outline";
import { useEffect } from "react";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  getInitColorSchemeScript,
  useMediaQuery,
} from "@mui/material";

export const loader = async ({ request }: LoaderArgs) => {
  // load site settings cookie
  const settingsSession = await getSettingsSession(
    request.headers.get("Cookie")
  );

  let settings: SettingsType = settingsSession.get("settings");
  console.log(settings);

  // If settings cookie does not exist, initialize it.
  if (!settings) {
    const locale = await i18next.getLocale(request);

    settings = {
      darkMode: "system",
      language: locale === "en" || locale === "ja" ? locale : "en",
    };

    settingsSession.set("settings", settings);
  }

  const headers = new Headers();
  headers.append("Set-Cookie", await commitSettingsSession(settingsSession));

  return json({ settings }, { headers });
};

export const handle = {
  i18n: i18n.ns,
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function App() {
  const { settings } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();
  // const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
  //   noSsr: true,
  // });

  useChangeLanguage(settings.language);

  // useEffect(() => {
  // console.log(settings.darkMode);

  // console.log(prefersDarkMode);
  //   const aa = getInitColorSchemeScript();
  //   console.log(aa);
  // });

  return (
    <html lang={settings.language} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {getInitColorSchemeScript()}
        <CssVarsProvider>
          <Outlet />
        </CssVarsProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

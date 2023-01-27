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
import { DarkThemeProvider } from "~/providers/darkThemeProvider";
import styles from "~/styles/root.css";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import i18n from "./i18n";
import type { SettingsType } from "./types/outline";
import { useEffect } from "react";

export const loader = async ({ request }: LoaderArgs) => {
  // load site settings cookie
  const settingsSession = await getSettingsSession(
    request.headers.get("Cookie")
  );

  let settings: SettingsType = settingsSession.get("settings");

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

  useEffect(() => {
    i18n.changeLanguage(settings.language);
  }, [settings.language, i18n]);

  return (
    <html lang={settings.language} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <DarkThemeProvider darkMode={settings.darkMode}>
          <Outlet />
        </DarkThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

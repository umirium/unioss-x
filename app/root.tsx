import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { DarkThemeProvider } from "~/providers/darkThemeProvider";
import styles from "~/styles/root.css";
import { useChangeLanguage } from "remix-i18next";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import i18n from "./i18n";

export const loader = async ({ request }: LoaderArgs) => {
  const locale = await i18next.getLocale(request);
  return { locale };
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
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <DarkThemeProvider>
          <Outlet />
        </DarkThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

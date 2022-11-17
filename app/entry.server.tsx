import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/server-runtime";
import { createInstance } from "i18next";
import BackendFS from "i18next-fs-backend";
import BackendHTTP from "i18next-http-backend";
import { resolve } from "node:path";
import { renderToString } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getSession as getSettingsSession } from "~/utils/sessions/settings.server";
import i18next from "./i18next.server";
import i18n from "./i18n";
import type { SettingsType } from "./types/outline";

export default async function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  context: EntryContext
) {
  const instance = createInstance();

  const settingsSession = await getSettingsSession(
    request.headers.get("Cookie")
  );
  const settings: SettingsType = settingsSession.get("settings");

  const lng = settings ? settings.language : await i18next.getLocale(request);
  const ns = i18next.getRouteNamespaces(context);

  if (process.env.NODE_ENV === "production") {
    instance.use(BackendHTTP);
  } else {
    instance.use(BackendFS);
  }

  await instance.use(initReactI18next).init({
    ...i18n,
    lng,
    ns,
    backend: {
      loadPath:
        process.env.NODE_ENV === "production"
          ? "https://umirium.github.io/unioss-x-i18n/locales/{{lng}}/{{ns}}.json"
          : resolve("./public/locales/{{lng}}/{{ns}}.json"),
    },
  });

  const markup = renderToString(
    <I18nextProvider i18n={instance}>
      <RemixServer context={context} url={request.url} />
    </I18nextProvider>
  );

  headers.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: statusCode,
    headers: headers,
  });
}

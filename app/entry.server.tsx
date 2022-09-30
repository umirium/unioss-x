import { PassThrough } from "stream";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/server-runtime";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { renderToPipeableStream } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18next from "./i18next.server";
import i18n from "./i18n";
import { Response } from "@remix-run/node";

export default async function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  context: EntryContext
) {
  const instance = createInstance();

  const lng = await i18next.getLocale(request);
  const ns = i18next.getRouteNamespaces(context);

  await instance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...i18n,
      lng,
      ns,
      backend: {
        loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
      },
    });

  return new Promise((resolve) => {
    const { pipe } = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <RemixServer context={context} url={request.url} />
      </I18nextProvider>,
      {
        onShellReady() {
          const body = new PassThrough();

          headers.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              status: statusCode,
              headers: headers,
            })
          );
          pipe(body);
        },
      }
    );
  });
}

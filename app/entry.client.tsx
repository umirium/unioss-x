import { RemixBrowser } from "@remix-run/react";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import BackendHTTP from "i18next-http-backend";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getInitialNamespaces } from "remix-i18next";
import i18n from "./i18n";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(BackendHTTP)
  .init({
    ...i18n,
    ns: getInitialNamespaces(),
    backend: {
      loadPath:
        process.env.NODE_ENV === "production"
          ? "https://umirium.github.io/unioss-x-i18n/locales/{{lng}}/{{ns}}.json"
          : "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: ["htmlTag"],
      caches: [],
    },
  })
  .then(() => {
    return hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <RemixBrowser />
      </I18nextProvider>
    );
  });

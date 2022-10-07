import type { BackendModule, NewableModule } from "i18next";
import BackendFS from "i18next-fs-backend";
import BackendHTTP from "i18next-http-backend";
import { RemixI18Next } from "remix-i18next";
import i18n from "./i18n";

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
  },
  i18next: {
    ...i18n,
    backend: {
      loadPath:
        process.env.NODE_ENV === "production"
          ? "https://umirium.github.io/unioss-x-i18n/locales/{{lng}}/{{ns}}.json"
          : "./public/locales/{{lng}}/{{ns}}.json",
    },
  },
  // NOTE: measure for type error
  backend: (process.env.NODE_ENV === "production"
    ? BackendHTTP
    : BackendFS) as unknown as NewableModule<BackendModule<unknown>>,
});

export default i18next;

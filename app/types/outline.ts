export type SettingsType = {
  darkMode: "light" | "dark" | "system";
  language: "en" | "ja";
};

export type SettingsHandler = { closeSettingsDrawer(): void };

export type PasswordFieldHandler = { reset(): void };

export type NoticeType = {
  key: string;
  options?: {
    [key: string]: string;
  };
};

export type DarkModeType = "light" | "dark" | undefined;

export type SettingsHandler = { closeSettingsDrawer(): void };

export type PasswordFieldHandler = { reset(): void };

export type NoticeType = {
  key: string;
  options?: {
    [key: string]: string;
  };
};

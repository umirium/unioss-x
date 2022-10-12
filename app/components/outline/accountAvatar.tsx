import type { MouseEvent } from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
import type { PaletteMode } from "@mui/material";
import {
  Box,
  Button,
  Avatar,
  Popover,
  ButtonBase,
  Divider,
  createTheme,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { blue, grey, purple } from "@mui/material/colors";
import { Form, useLocation, useSubmit } from "@remix-run/react";
import type { SettingsHandler } from "~/types/outline";
import type { definitions } from "~/types/tables";
import type { SnakeToCamel } from "snake-camel-types";
import { MyLinkButton } from "../atoms/MyLinkButton";
import { useTranslation } from "react-i18next";
import {
  usePopupState,
  bindPopover,
  anchorRef,
} from "material-ui-popup-state/hooks";
import SettingsDrawer from "./accountAvatar/settingsDrawer";

interface Props {
  authUser: SnakeToCamel<definitions["users"]> | null;
  onClick: () => void;
}

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    primary: {
      main: mode === "light" ? grey[800] : grey[100],
    },
  },
});

export default forwardRef<SettingsHandler, Props>(function AccountAvatar(
  props: Props,
  ref
) {
  const { authUser } = props;
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const popupState = usePopupState({ variant: "popover", popupId: "popover" });
  const location = useLocation();
  const submit = useSubmit();
  const { t } = useTranslation();
  const darkTheme = useTheme();
  const theme = createTheme(getDesignTokens(darkTheme.palette.mode));

  // Allow other components can close Settings Drawer.
  useImperativeHandle(ref, () => ({
    closeSettingsDrawer: () => {
      setSettingsDrawerOpen(false);
    },
  }));

  const handleCloseSettingsDrawer = () => {
    setSettingsDrawerOpen(false);
  };

  const handleClickSettings = () => {
    popupState.close();
    setSettingsDrawerOpen(true);
  };

  const handleClickAvatar = (event: MouseEvent<HTMLButtonElement>) => {
    props.onClick();
    setSettingsDrawerOpen(false);
    popupState.open();
  };

  const handleClickSignin = () => {
    popupState.close();
  };

  const handleClickSignout = async (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    popupState.close();
    submit(event.currentTarget);
  };

  return (
    <>
      <Avatar
        component={ButtonBase}
        sx={
          authUser?.userId
            ? darkTheme.palette.mode === "light"
              ? { bgcolor: purple[700] }
              : { bgcolor: blue[400] }
            : darkTheme.palette.mode === "light"
            ? { bgcolor: blue[900] }
            : { bgcolor: grey[400] }
        }
        onClick={handleClickAvatar}
        ref={(c: HTMLButtonElement) => {
          anchorRef(popupState)(c);
        }}
      >
        {authUser && authUser.lastName?.substring(0, 1)}
      </Avatar>

      {/* for Avatar */}
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ mt: 2 }}
      >
        <Box sx={{ p: 2, textAlign: "center", minWidth: 250 }}>
          {authUser?.userId ? (
            <>
              <Box>
                {authUser?.lastName} {authUser?.firstName}
              </Box>
              <Box>{authUser?.email}</Box>
            </>
          ) : (
            <Box>{t("front:guest")}</Box>
          )}

          <ThemeProvider theme={theme}>
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              sx={{
                mt: 3,
                borderRadius: 28,
              }}
              onClick={handleClickSettings}
            >
              {t("common:settings")}
            </Button>
          </ThemeProvider>

          <Divider sx={{ mt: 2, mb: 2 }} />
          <Box>
            {authUser?.userId ? (
              <>
                <Form method="post">
                  <input
                    type="hidden"
                    name="redirectTo"
                    value={location.pathname}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    name="signout"
                    value={1}
                    onClick={handleClickSignout}
                  >
                    {t("common:signout")}
                  </Button>
                </Form>
              </>
            ) : (
              <MyLinkButton
                variant="contained"
                onClick={handleClickSignin}
                disabled={location.pathname === "/front/signin"}
                to={`/front/signin${
                  location.pathname && `?r=${location.pathname}`
                }`}
              >
                {t("common:signin")}
              </MyLinkButton>
            )}
          </Box>
        </Box>
      </Popover>

      <SettingsDrawer
        open={settingsDrawerOpen}
        onClose={handleCloseSettingsDrawer}
      />
    </>
  );
});

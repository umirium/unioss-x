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
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { blue, grey, purple } from "@mui/material/colors";
import { Form, useLocation, useNavigate, useSubmit } from "@remix-run/react";
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

const getDesignTokens = () => ({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: grey[800],
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: grey[100],
        },
      },
    },
    // palette: {
    //   primary: {
    //     main: mode === "light" ? grey[800] : grey[100],
    //   },
    // },
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
  const navigate = useNavigate();
  const darkTheme = useTheme();
  const theme = extendTheme(getDesignTokens());

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
    submit(event.currentTarget, { method: "post" });
  };

  const handleClickMypage = async (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    popupState.close();

    if (authUser) {
      navigate("/front/mypage");
      return;
    }

    navigate("/front/signin?r=/front/mypage");
  };

  return (
    <>
      {/* <Avatar
        component={ButtonBase}
        sx={
          authUser?.id
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
      </Avatar> */}

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
          {authUser?.id ? (
            <>
              <Box>
                {authUser?.lastName} {authUser?.firstName}
              </Box>
              <Box>{authUser?.email}</Box>
            </>
          ) : (
            <Box>{t("common:guest")}</Box>
          )}

          {authUser?.id && (
            <>
              <Box>
                <CssVarsProvider theme={theme}>
                  <Button
                    variant="contained"
                    startIcon={<PersonIcon />}
                    sx={{
                      mt: 3,
                    }}
                    onClick={handleClickMypage}
                  >
                    {t("front:mypage")}
                  </Button>
                </CssVarsProvider>
              </Box>
            </>
          )}

          <Divider sx={{ mt: 2 }} />

          <Box>
            <CssVarsProvider theme={theme}>
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                sx={{
                  mt: 2,
                  borderRadius: 28,
                }}
                onClick={handleClickSettings}
              >
                {t("common:settings")}
              </Button>
            </CssVarsProvider>
          </Box>

          <Box sx={{ mt: 3 }}>
            {authUser?.id ? (
              <>
                <Form method="post">
                  <input
                    type="hidden"
                    name="redirectTo"
                    value={location.pathname}
                  />

                  <Button
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

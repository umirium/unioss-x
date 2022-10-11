import type { ReactElement, MouseEvent } from "react";
import { useRef, useState } from "react";
import type { PaletteMode } from "@mui/material";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  useScrollTrigger,
  Button,
  Avatar,
  Popover,
  ButtonBase,
  Divider,
  createTheme,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import { grey } from "@mui/material/colors";
import TopButton from "./outline/topButton";
import FlexDrawer from "./outline/flexDrawer";
import { useTranslation } from "react-i18next";
import { Form, useLocation, useNavigate, useSubmit } from "@remix-run/react";
import SettingsButton from "./outline/settingsButton";
import type { SettingsHandler } from "~/types/outline";
import type { definitions } from "~/types/tables";
import type { SnakeToCamel } from "snake-camel-types";
import { MyLinkButton } from "./atoms/MyLinkButton";

interface Props {
  children: ReactElement;
  authUser: SnakeToCamel<definitions["users"]> | null;
  drawerWidth?: number;
}

const HideAppbarOnScroll = (props: Props) => {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    primary: {
      main: mode === "light" ? grey[800] : grey[100],
    },
  },
});

export default function Outline(props: Props) {
  const { children, authUser, drawerWidth } = props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const settingsButtonRef = useRef({} as SettingsHandler);
  const location = useLocation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const { t } = useTranslation();
  const darkTheme = useTheme();

  const theme = createTheme(getDesignTokens(darkTheme.palette.mode));

  const handleToggleMobileMenu = () => {
    // close settings drawer
    settingsButtonRef?.current.closeSettings();

    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCloseSettingsMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleClickLogo = (
    event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
  ) => {
    // close menu and settings drawers
    setMobileMenuOpen(false);
    settingsButtonRef?.current.closeSettings();

    navigate("/front");
  };

  const handleClickSignin = () => {
    // close menu and settings drawers
    setMobileMenuOpen(false);
    settingsButtonRef?.current.closeSettings();
  };

  const handleClickAvatar = (event: MouseEvent<HTMLButtonElement>) => {
    // close menu and settings drawers
    setMobileMenuOpen(false);
    settingsButtonRef?.current.closeSettings();

    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    handleClosePopover();
    submit(event.currentTarget);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <HideAppbarOnScroll {...props}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleToggleMobileMenu}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1, display: "flex" }}>
              <Typography
                variant="h6"
                sx={{ cursor: "pointer" }}
                onClick={handleClickLogo}
              >
                {t("front:title")}
              </Typography>
            </Box>

            <SettingsButton
              ref={settingsButtonRef}
              onClose={handleCloseSettingsMenu}
              sx={{ mr: 2 }}
            />

            {authUser ? (
              <Avatar component={ButtonBase} onClick={handleClickAvatar}>
                {authUser.lastName?.substring(0, 1)}
              </Avatar>
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

            {/* for Avatar */}
            <Popover
              open={!!anchorEl}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              sx={{ mt: 2, minWidth: 350 }}
            >
              <Box sx={{ p: 2, textAlign: "center" }}>
                {authUser?.email ? (
                  <>
                    <Box>
                      {authUser?.lastName} {authUser?.firstName}
                    </Box>
                    <Box>{authUser?.email}</Box>
                  </>
                ) : (
                  <Box>Guest</Box>
                )}

                <ThemeProvider theme={theme}>
                  <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    sx={{
                      mt: 3,
                      borderRadius: 28,
                    }}
                  >
                    {t("common:settings")}
                  </Button>
                </ThemeProvider>

                <Divider sx={{ mt: 2, mb: 2 }} />
                <Box>
                  {authUser?.email ? (
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
                          onClick={handleSubmit}
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
          </Toolbar>
        </AppBar>
      </HideAppbarOnScroll>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth || 240 }, flexShrink: { md: 0 } }}
        aria-label="menu"
      >
        {/* for mobile */}
        <FlexDrawer
          variant="temporary"
          open={mobileMenuOpen}
          onClose={handleToggleMobileMenu}
        />

        {/* for PC */}
        <FlexDrawer variant="permanent" open />
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: 1000 }}>
        <Toolbar />
        {children}
      </Box>

      <TopButton />
    </Box>
  );
}

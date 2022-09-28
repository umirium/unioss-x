import type { ReactElement, MouseEvent } from "react";
import { useRef, useState } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TopButton from "./outline/topButton";
import FlexDrawer from "./outline/flexDrawer";
import { useTranslation } from "react-i18next";
import { Form, Link, useLocation, useSubmit } from "@remix-run/react";
import SettingsButton from "./outline/settingsButton";
import type { SettingsHandler } from "~/types/outline";
import type { definitions } from "~/types/tables";
import type { SnakeToCamel } from "snake-camel-types";

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

export default function Outline(props: Props) {
  const { children, authUser, drawerWidth } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const settingButtonRef = useRef({} as SettingsHandler);
  const location = useLocation();
  const submit = useSubmit();
  const { t } = useTranslation();

  const handleToggleMenu = () => {
    // close settings drawer
    settingButtonRef?.current.closeSettings();

    setMobileOpen(!mobileOpen);
  };

  const handleCloseMenu = () => {
    setMobileOpen(false);
  };

  const handleClickSignin = () => {
    // close menu and settings drawers
    setMobileOpen(false);
    settingButtonRef?.current.closeSettings();
  };

  const handleClickAvatar = (event: MouseEvent<HTMLButtonElement>) => {
    // close menu and settings drawers
    setMobileOpen(false);
    settingButtonRef?.current.closeSettings();

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
              onClick={handleToggleMenu}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              {t("front:title")}
            </Typography>
            <SettingsButton
              ref={settingButtonRef}
              onClose={handleCloseMenu}
              sx={{ mr: 2 }}
            />

            {authUser ? (
              <Avatar component={ButtonBase} onClick={handleClickAvatar}>
                {authUser.lastName?.substring(0, 1)}
              </Avatar>
            ) : (
              <Button
                variant="contained"
                component={Link}
                onClick={handleClickSignin}
                disabled={location.pathname === "/front/signin"}
                to={`/front/signin${
                  location.pathname && `?r=${location.pathname}`
                }`}
              >
                {t("common:signin")}
              </Button>
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
              sx={{ mt: 2 }}
            >
              <Box sx={{ p: 2 }}>
                <Box>
                  {authUser?.lastName} {authUser?.firstName}
                </Box>
                <Box>{authUser?.email}</Box>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Box sx={{ textAlign: "center" }}>
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
          open={mobileOpen}
          onClose={handleToggleMenu}
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

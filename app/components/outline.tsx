import type { ReactElement } from "react";
import { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Slide,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DrawerMenu from "./outline/drawerMenu";
import ToggleThemeButton from "./outline/toggleThemeButton";
import TopButton from "./outline/topButton";

interface Props {
  children: ReactElement;
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
  const { children, drawerWidth } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleDrawer = () => {
    setMobileOpen(!mobileOpen);
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
              onClick={handleToggleDrawer}
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
              Clipped drawer
            </Typography>
            <ToggleThemeButton />
          </Toolbar>
        </AppBar>
      </HideAppbarOnScroll>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth || 240 }, flexShrink: { md: 0 } }}
        aria-label="menu"
      >
        {/* for mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleToggleDrawer}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { sm: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth || 240,
            },
          }}
        >
          <DrawerMenu />
        </Drawer>

        {/* for PC */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth || 240,
            },
          }}
          open
        >
          <DrawerMenu />
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: 1000 }}>
        <Toolbar />
        {children}
      </Box>

      <TopButton />
    </Box>
  );
}

import type { ReactElement, MouseEvent } from "react";
import { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Fab,
  Slide,
  useScrollTrigger,
  Fade,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MenuIcon from "@mui/icons-material/Menu";
import DrawerMenu from "./outline/drawerMenu";
import ToggleThemeButton from "./outline/toggleThemeButton";

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

const ScrollTop = (props: Props) => {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
  });

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
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

      <ScrollTop>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </Box>
  );
}

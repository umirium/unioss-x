import type { ReactElement, MouseEvent } from "react";
import { useContext, useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Fab,
  Collapse,
  Slide,
  useScrollTrigger,
  Fade,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import { ColorModeContext } from "~/routes/mui";

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

const HideToolbarOnScroll = (props: Props) => {
  const { children } = props;
  const trigger = useScrollTrigger();

  return <Collapse in={!trigger}>{children}</Collapse>;
};

const ScrollTop = (props: Props) => {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
  });

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
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

const ToggleThemeButton = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode}>
      {theme.palette.mode == "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

export default function Outline(props: Props) {
  const { children, drawerWidth } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <HideToolbarOnScroll {...props}>
        <Toolbar />
      </HideToolbarOnScroll>

      <Box sx={{ overflow: "auto" }}>
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

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
        aria-label="mailbox folders"
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
          {drawer}
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
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: 1000 }}>
        <Toolbar id="back-to-top-anchor" />

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

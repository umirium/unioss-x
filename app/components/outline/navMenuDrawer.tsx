import type { DrawerProps } from "@mui/material";
import {
  useScrollTrigger,
  Collapse,
  Toolbar,
  Box,
  List,
  ListItem,
  Drawer,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import type { ReactElement } from "react";
import RouterLink from "./navMenuDrawer/routerLink";
import { useTranslation } from "react-i18next";

interface Props {
  children: ReactElement;
}

interface NavMenuDrawerProps extends DrawerProps {
  variant: "permanent" | "persistent" | "temporary" | undefined;
  drawerWidth?: number;
  open?: boolean | undefined;
  onClose?: () => void;
}

// NOTE:
// If it is declared in a functional component,
// Drawer scrolls up and hide the top part.
const HideToolbarOnScroll = (props: Props) => {
  const { children } = props;
  const trigger = useScrollTrigger();

  return <Collapse in={!trigger}>{children}</Collapse>;
};

export default function NavMenuDrawer(drawerProps: NavMenuDrawerProps) {
  const { t } = useTranslation();

  const handleClick = () => {
    if (drawerProps.onClose) {
      drawerProps.onClose();
    }
  };

  return (
    <Drawer
      {...drawerProps}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display:
          drawerProps.variant === "temporary"
            ? { sm: "block", md: "none" }
            : { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerProps.drawerWidth || 240,
        },
      }}
    >
      {drawerProps.variant === "temporary" ? (
        <Toolbar />
      ) : (
        <HideToolbarOnScroll>
          <Toolbar />
        </HideToolbarOnScroll>
      )}

      <Box sx={{ overflow: "auto" }}>
        <List>
          {[
            { to: "", text: t("front:top") },
            { to: "products", text: t("front:products") },
            { to: "aboutus", text: t("front:aboutus") },
            { to: "contact", text: t("front:contact") },
          ].map((item, index) => (
            <ListItem key={index} disablePadding>
              <RouterLink
                to={item.to}
                text={item.text}
                icon={<InboxIcon />}
                onClick={handleClick}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

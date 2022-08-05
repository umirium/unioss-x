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
import RouterLink from "./routerLink";
import { useTranslation } from "react-i18next";

interface Props {
  children: ReactElement;
}

interface FlexDrawerProps extends DrawerProps {
  variant: "permanent" | "persistent" | "temporary" | undefined;
  drawerWidth?: number;
  open?: boolean | undefined;
  onClose?: () => void;
}

export default function FrexDrawer(drawerProps: FlexDrawerProps) {
  const { t } = useTranslation("front");

  const HideToolbarOnScroll = (props: Props) => {
    const { children } = props;
    const trigger = useScrollTrigger();

    return <Collapse in={!trigger}>{children}</Collapse>;
  };

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
            { to: "", text: t("top") },
            { to: "products", text: t("products") },
            { to: "aboutus", text: t("aboutus") },
            { to: "contact", text: t("contact") },
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

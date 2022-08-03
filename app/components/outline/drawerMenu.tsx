import {
  useScrollTrigger,
  Collapse,
  Toolbar,
  Box,
  List,
  ListItem,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import type { ReactElement } from "react";
import RouterLink from "./routerLink";

interface Props {
  children: ReactElement;
}

const HideToolbarOnScroll = (props: Props) => {
  const { children } = props;
  const trigger = useScrollTrigger();

  return <Collapse in={!trigger}>{children}</Collapse>;
};

export default function DrawerMenu() {
  return (
    <>
      <HideToolbarOnScroll>
        <Toolbar />
      </HideToolbarOnScroll>

      <Box sx={{ overflow: "auto" }}>
        <List>
          {[
            { to: "", text: "Top" },
            { to: "products", text: "Products" },
            { to: "about", text: "About" },
            { to: "contact", text: "Contact" },
          ].map((item, index) => (
            <ListItem key={index} disablePadding>
              <RouterLink to={item.to} text={item.text} icon={<InboxIcon />} />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}

import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import type { PropsWithChildren, ReactElement } from "react";
import { forwardRef, useMemo } from "react";
import type { NavLinkProps } from "react-router-dom";
import { NavLink } from "react-router-dom";

type RouterLinkProps = PropsWithChildren<{
  to: string;
  text: string;
  icon: ReactElement;
}>;

// cf.
//   Using React Router NavLink with a MUI ListItemButton + TypeScript - Dragosh Mocrii
//   https://dragoshmocrii.com/using-react-router-navlink-with-a-mui-listitembutton-typescript/
export default function RouterLink(props: RouterLinkProps) {
  type MyNavLinkProps = Omit<NavLinkProps, "to">;

  const MyNavLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, MyNavLinkProps>(function callback(
        navLinkProps,
        ref
      ) {
        const { className: previousClasses, ...rest } = navLinkProps;
        const elementClasses = previousClasses?.toString() ?? "";

        return (
          // eslint-disable-next-line jsx-a11y/anchor-has-content
          <NavLink
            {...rest}
            ref={ref}
            to={props.to}
            end
            className={({ isActive }) =>
              isActive ? elementClasses + " Mui-selected" : elementClasses
            }
          />
        );
      }),
    [props.to]
  );

  return (
    <ListItemButton component={MyNavLink}>
      <ListItemIcon
        sx={{
          ".Mui-selected > &": { color: (theme) => theme.palette.primary.main },
        }}
      >
        {props.icon}
      </ListItemIcon>
      <ListItemText primary={props.text} />
    </ListItemButton>
  );
}

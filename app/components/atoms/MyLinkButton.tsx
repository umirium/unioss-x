import type { ElementType } from "react";
import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";
import { Link, useTransition } from "@remix-run/react";

export const MyLinkButton = <C extends ElementType>(
  props: ButtonProps<C, { component?: C }> & {
    to: string;
  }
) => {
  const { children, ...rest } = props;
  const transition = useTransition();

  return (
    <Button
      {...rest}
      component={Link}
      disabled={transition.state === "loading"}
    >
      {children}
    </Button>
  );
};

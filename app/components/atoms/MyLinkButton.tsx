import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";
import { Link, useTransition } from "@remix-run/react";

export const MyLinkButton = <C extends React.ElementType>(
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

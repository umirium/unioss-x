import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";
import { useTransition } from "@remix-run/react";
import { useTranslation } from "react-i18next";

interface Props extends ButtonProps {
  label: string;
}

export const MySubmitButton = (props: Props) => {
  const transition = useTransition();
  const { t } = useTranslation();

  return (
    <Button
      {...props}
      type="submit"
      disabled={transition.state !== "idle"}
      variant="contained"
    >
      {t(`common:${props.label}`)}
    </Button>
  );
};

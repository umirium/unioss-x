import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";
import { useTransition } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useIsSubmitting } from "remix-validated-form";

interface Props extends ButtonProps {
  label: string;
}

export const MySubmitButton = (props: Props) => {
  const isSubmitting = useIsSubmitting();
  const transition = useTransition();
  const { t } = useTranslation();

  return (
    <Button
      {...props}
      type="submit"
      disabled={isSubmitting || transition.state === "loading"}
      variant="contained"
      color="primary"
    >
      {t(`common:${props.label}`)}
    </Button>
  );
};

import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";
import { useIsSubmitting } from "remix-validated-form";

interface Props extends ButtonProps {
  label: string;
}

export const MySubmitButton = (props: Props) => {
  const isSubmitting = useIsSubmitting();

  return (
    <Button
      {...props}
      type="submit"
      disabled={isSubmitting}
      variant="contained"
      color="primary"
    >
      {props.label}
    </Button>
  );
};

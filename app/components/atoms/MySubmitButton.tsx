import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useIsSubmitting } from "remix-validated-form";

export const MySubmitButton = () => {
  const { t } = useTranslation("common");

  const isSubmitting = useIsSubmitting();
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      variant="contained"
      color="primary"
    >
      {t("next")}
    </Button>
  );
};

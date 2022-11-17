import { Box } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MyLinkButton } from "~/components/atoms/MyLinkButton";
import { useStep } from "../contact";

export default function Complete() {
  const { handleChangeStep } = useStep();
  const { t } = useTranslation();

  // set Stepper
  useEffect(() => {
    handleChangeStep(3);
  });

  return (
    <Box sx={{ maxWidth: 800, m: "auto" }}>
      <h1>{t("front:registered")}</h1>

      <Box sx={{ textAlign: "center" }}>
        <MyLinkButton to="../../" color="primary">
          {t("front:goToSignin")}
        </MyLinkButton>
      </Box>
    </Box>
  );
}

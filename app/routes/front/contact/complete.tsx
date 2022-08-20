import { Box, Button } from "@mui/material";
import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStep } from "../contact";

export default function Complete() {
  const { handleChangeStep } = useStep();
  const { t } = useTranslation();

  // set Stepper
  useEffect(() => {
    handleChangeStep(4);
  });

  return (
    <Box sx={{ maxWidth: 800, m: "auto" }}>
      <h1>{t("front:complete")}</h1>

      <Box sx={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="../../"
        >
          {t("common:home")}
        </Button>
      </Box>
    </Box>
  );
}

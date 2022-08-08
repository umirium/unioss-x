import { Box, Button } from "@mui/material";
import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStep } from "../contact";

export default function Complete() {
  const { handleChangeStep } = useStep();
  const { t } = useTranslation("front");

  // set Stepper
  useEffect(() => {
    handleChangeStep(4);
  });

  return (
    <Box sx={{ maxWidth: 800, m: "auto" }}>
      <h1>{t("complete")}</h1>

      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="../../"
        >
          Home
        </Button>
      </Box>
    </Box>
  );
}

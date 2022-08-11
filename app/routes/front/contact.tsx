import { Box, Step, StepLabel, Stepper } from "@mui/material";
import { Outlet } from "@remix-run/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";

type ContextType = { handleChangeStep: (index: number) => void };

export default function Contact() {
  const [step, setStep] = useState<number>(0);
  const { t } = useTranslation("front");

  const steps = [t("customerInfo"), t("inquiry"), t("confirm"), t("complete")];

  const handleChangeStep = (index: number) => {
    setStep(index);
  };

  return (
    <Box>
      <Box sx={{ width: "100%", mb: 5 }}>
        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Outlet context={{ handleChangeStep }} />
    </Box>
  );
}

export function useStep() {
  return useOutletContext<ContextType>();
}

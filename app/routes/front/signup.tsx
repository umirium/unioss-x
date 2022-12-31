import { Box, Step, StepLabel, Stepper } from "@mui/material";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { authenticator } from "~/utils/auth.server";

type ContextType = { handleChangeStep: (index: number) => void };

export const meta: MetaFunction<typeof loader> = ({ parentsData }) => {
  return {
    title: `${parentsData["routes/front"].siteTitle} | sign-up`,
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const authUser = await authenticator.isAuthenticated(request);

  // If signed-in, redirect top.
  if (authUser) {
    return redirect("/front");
  }

  return null;
};

export default function Signup() {
  const [step, setStep] = useState<number>(0);
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  const handleChangeStep = (index: number) => {
    setStep(index);
  };

  return (
    <Box>
      <Box sx={{ width: "100%", mb: 5 }}>
        <Stepper activeStep={step} alternativeLabel>
          {[
            t("front:customerInfo"),
            t("front:confirm"),
            t("front:registered"),
          ].map((label) => (
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

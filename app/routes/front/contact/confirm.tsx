import { Alert, Box, Button, Grid, Paper } from "@mui/material";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
import { withYup } from "@remix-validated-form/with-yup";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { ValidationErrorResponseData } from "remix-validated-form";
import { ValidatedForm, validationError } from "remix-validated-form";
import { MyInput } from "~/components/atoms/MyInput";
import { MySubmitButton } from "~/components/atoms/MySubmitButton";
import {
  contactInquirySchema,
  contactPersonalInfoSchema,
} from "~/stores/validator";
import type {
  ContactInquiryType,
  ContactPersonalInfoType,
} from "~/types/contactFormType";
import { contactCookie } from "~/utils/cookies";
import { useStep } from "../contact";

const validator = withYup(
  contactPersonalInfoSchema.concat(contactInquirySchema)
);

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await contactCookie.parse(cookieHeader)) || {};

  return json(cookie);
};

export const action: ActionFunction = async ({ request }) => {
  // for test
  // await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000));

  // validation
  const form = await validator.validate(await request.formData());
  if (form.error) return validationError(form.error);

  // session (cookie)
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await contactCookie.parse(cookieHeader)) || {};

  return redirect("/front/contact/complete", {
    headers: {
      "Set-Cookie": await contactCookie.serialize({ ...cookie, ...form.data }),
    },
  });
};

export default function Confirm() {
  const { handleChangeStep } = useStep();
  const formData = useLoaderData<
    ContactPersonalInfoType & ContactInquiryType
  >();
  const validated = useActionData<ValidationErrorResponseData>();
  const { t } = useTranslation();

  // set Stepper
  useEffect(() => {
    handleChangeStep(2);
  });

  return (
    <ValidatedForm validator={validator} method="post">
      {validated &&
        Object.entries(validated.fieldErrors).map(([key, value], index) => (
          <Alert key={index} severity="error">
            {t(`front:${key}`)}: {t(`validator:${value}`)}
          </Alert>
        ))}

      <Box sx={{ maxWidth: 800, m: "auto" }}>
        <Paper elevation={1} sx={{ pb: 2 }}>
          {Object.entries(formData).map(([key, value], index) => (
            <Grid container key={key} spacing={3} sx={{ mt: 1, mb: 1 }}>
              <MyInput type="hidden" label={key} defaultValue={value} />
              <Grid xs={6} sm={6} md={6} sx={{ textAlign: "center" }} item>
                {t(`front:${key}`)}
              </Grid>
              <Grid
                xs={6}
                sm={6}
                md={6}
                sx={{ textAlign: "center", overflowWrap: "break-word" }}
                item
              >
                {value}
              </Grid>
            </Grid>
          ))}
        </Paper>

        <Box sx={{ mt: 5, textAlign: "center" }}>
          <Button
            variant="outlined"
            component={Link}
            to="../inquiry"
            sx={{ mr: 3 }}
          >
            {t("common:back")}
          </Button>
          <MySubmitButton label="send" />
        </Box>
      </Box>
    </ValidatedForm>
  );
}

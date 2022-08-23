import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { withYup } from "@remix-validated-form/with-yup";
import { useEffect, useState } from "react";
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
import { contactCookie } from "~/utils/cookies.server";
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

  // transmission process...
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000));

  return redirect("/front/contact/complete", {
    headers: {
      "Set-Cookie": await contactCookie.serialize({}),
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
  const [progress, setProgress] = useState(false);
  const navigate = useNavigate();

  // If cookie has been deleted, redirect to contact form.
  useEffect(() => {
    if (Object.keys(formData).length === 0) {
      navigate("/front/contact");
    }
  }, [formData, navigate]);

  // set Stepper
  useEffect(() => {
    handleChangeStep(2);
  });

  const handleSend = () => {
    setProgress(true);
  };

  return (
    <ValidatedForm validator={validator} method="post">
      {validated &&
        Object.entries(validated.fieldErrors).map(([key, value], index) => (
          <Alert key={index} severity="error">
            {t(`front:${key}`)}: {t(`validator:${value}`)}
          </Alert>
        ))}

      {progress && (
        <Box
          sx={{
            pb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />{" "}
          <Typography sx={{ pl: 2, color: "primary.main" }}>
            {t("sending")}
          </Typography>
        </Box>
      )}

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
          <MySubmitButton
            label="send"
            endIcon={<SendIcon />}
            onClick={handleSend}
          />
        </Box>
      </Box>
    </ValidatedForm>
  );
}

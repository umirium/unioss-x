import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import type { LoaderArgs, ActionArgs, Session } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { withYup } from "@remix-validated-form/with-yup";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { validationError } from "remix-validated-form";
import { MySubmitButton } from "~/components/atoms/MySubmitButton";
import {
  contactInquirySchema,
  contactPersonalSchema,
} from "~/stores/validator";
import type {
  ContactInquiryType,
  ContactPersonalInfoType,
} from "~/types/contactFormType";
import { destroySession, getSession } from "~/utils/sessions/contact.server";
import { useStep } from "../contact";
import { MyLinkButton } from "~/components/atoms/MyLinkButton";
import prefectures from "~/stores/prefectures";
import { categories } from "~/stores/contact";

const validator = withYup(
  contactPersonalSchema.omit(["emailRetype"]).concat(contactInquirySchema)
);

const getContactData = async (session: Session) => {
  return {
    email: session.get("email"),
    emailRetype: session.get("emailRetype"),
    lastName: session.get("lastName"),
    firstName: session.get("firstName"),
    lastNameKana: session.get("lastNameKana"),
    firstNameKana: session.get("firstNameKana"),
    postalCode: session.get("postalCode"),
    prefecture: session.get("prefecture"),
    city: session.get("city"),
    address1: session.get("address1"),
    address2: session.get("address2"),
    phoneNumber: session.get("phoneNumber"),
    category: session.get("category"),
    productName: session.get("productName"),
    orderCode: session.get("orderCode"),
    inquiry: session.get("inquiry"),
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const data: ContactPersonalInfoType & ContactInquiryType =
    await getContactData(await getSession(request.headers.get("Cookie")));

  return data;
};

export const action = async ({ request }: ActionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const data: ContactPersonalInfoType & ContactInquiryType =
    await getContactData(session);

  // validation
  const form = await validator.validate(data);
  if (form.error) return validationError(form.error);

  // transmission process...
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 10000));

  // destroy contact session
  const headers = new Headers();
  headers.append("Set-Cookie", await destroySession(session));

  return redirect("/front/contact/complete", { headers });
};

export default function Confirm() {
  const { handleChangeStep } = useStep();
  const formData = useLoaderData<typeof loader>();
  const validated = useActionData<typeof action>();
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
    <Form replace method="post">
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
            {t("common:sending")}
          </Typography>
        </Box>
      )}

      <Box sx={{ maxWidth: 800, m: "auto" }}>
        <Paper elevation={1} sx={{ pb: 2 }}>
          {Object.entries(formData)
            .map(([key, value], _index) => {
              if (key === "emailRetype") {
                return undefined;
              }

              let confirmValue = value;

              if (key === "prefecture") {
                confirmValue = prefectures(t).filter(
                  (e) => e.value.toString() === value
                )[0]?.label;
              }

              if (key === "category") {
                confirmValue = categories(t).filter(
                  (e) => e.value.toString() === value
                )[0]?.label;
              }

              return (
                <Grid container key={key} spacing={3} sx={{ mt: 1, mb: 1 }}>
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
                    {confirmValue}
                  </Grid>
                </Grid>
              );
            })
            .filter((e) => typeof e !== "undefined")}
        </Paper>

        <Box sx={{ mt: 5, textAlign: "center" }}>
          <MyLinkButton variant="outlined" to="../inquiry" sx={{ mr: 3 }}>
            {t("common:back")}
          </MyLinkButton>

          <MySubmitButton
            label="send"
            endIcon={<SendIcon />}
            onClick={handleSend}
          />
        </Box>
      </Box>
    </Form>
  );
}

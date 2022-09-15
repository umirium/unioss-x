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
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { withYup } from "@remix-validated-form/with-yup";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { validationError } from "remix-validated-form";
import { personalDataFormSchema } from "~/stores/validator";
import type { PersonalData } from "~/types/contactFormType";
import { useStep } from "../signup";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/utils/sessions/signup";

const validator = withYup(personalDataFormSchema);

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const data: PersonalData = {
    email: session.get("email"),
    password: "****************",
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
  };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const action = async ({ request }: ActionArgs) => {
  // for test
  // await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000));

  const session = await getSession(request.headers.get("Cookie"));

  const data: PersonalData = {
    email: session.get("email"),
    emailRetype: session.get("emailRetype"),
    password: session.get("password"),
    passwordRetype: session.get("passwordRetype"),
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
  };

  // validation
  const form = await validator.validate(data);
  if (form.error) return validationError(form.error);

  // transmission process...
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 5000));

  return redirect("/front/signup/complete", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function Confirm() {
  const { handleChangeStep } = useStep();
  const formData = useLoaderData<typeof loader>();
  const validated = useActionData<typeof action>();
  const { t } = useTranslation();
  const [progress, setProgress] = useState(false);
  const navigate = useNavigate();

  // If cookie has been deleted, redirect to signup form.
  useEffect(() => {
    if (Object.keys(formData).length === 0) {
      navigate("/front/signup");
    }
  }, [formData, navigate]);

  // set Stepper
  useEffect(() => {
    handleChangeStep(1);
  });

  const handleSend = () => {
    setProgress(true);
  };

  return (
    <>
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
              {t("sending")}
            </Typography>
          </Box>
        )}

        <Box sx={{ maxWidth: 800, m: "auto" }}>
          <Paper elevation={1} sx={{ pb: 2 }}>
            {Object.entries(formData).map(([key, value], index) => (
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
                  {value}
                </Grid>
              </Grid>
            ))}
          </Paper>

          <Box sx={{ mt: 5, textAlign: "center" }}>
            <Button variant="outlined" component={Link} to="../" sx={{ mr: 3 }}>
              {t("common:back")}
            </Button>
            <Button
              variant="contained"
              type="submit"
              onClick={handleSend}
              sx={{ mr: 3 }}
              endIcon={<SendIcon />}
            >
              {t("common:send")}
            </Button>
          </Box>
        </Box>
      </Form>
    </>
  );
}

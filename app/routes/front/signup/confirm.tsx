import {
  Alert,
  Box,
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
  useActionData,
  useLoaderData,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import { withYup } from "@remix-validated-form/with-yup";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { validationError } from "remix-validated-form";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import type { SnakeToCamel } from "snake-camel-types";
import { personalDataFormSchema } from "~/stores/validator";
import type { PersonalData } from "~/types/contactFormType";
import { useStep } from "../signup";
import { getSession as getSettingsSession } from "~/utils/sessions/settings.server";
import {
  commitSession as commitSignupSession,
  destroySession as destroySignupSession,
  getSession as getSignupSession,
} from "~/utils/sessions/signup.server";
import {
  commitSession as commitAuthSession,
  getSession as getAuthSession,
} from "~/utils/sessions/auth.server";
import { db } from "~/utils/db.server";
import type { definitions } from "~/types/tables";
import { MySubmitButton } from "~/components/atoms/MySubmitButton";
import { MyLinkButton } from "~/components/atoms/MyLinkButton";
import {
  MODE_DARK,
  MODE_LIGHT,
  MODE_SYSTEM,
} from "~/utils/constants/index.server";
import type { SettingsType } from "~/types/outline";

const validator = withYup(personalDataFormSchema);

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSignupSession(request.headers.get("Cookie"));

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
      "Set-Cookie": await commitSignupSession(session),
    },
  });
};

export const action = async ({ request }: ActionArgs) => {
  let inserted: SnakeToCamel<definitions["users"]> | undefined;

  const signupSession = await getSignupSession(request.headers.get("Cookie"));

  // validate input data in form
  const data: PersonalData = {
    email: signupSession.get("email"),
    emailRetype: signupSession.get("emailRetype"),
    password: signupSession.get("password"),
    passwordRetype: signupSession.get("passwordRetype"),
    lastName: signupSession.get("lastName"),
    firstName: signupSession.get("firstName"),
    lastNameKana: signupSession.get("lastNameKana"),
    firstNameKana: signupSession.get("firstNameKana"),
    postalCode: signupSession.get("postalCode"),
    prefecture: signupSession.get("prefecture"),
    city: signupSession.get("city"),
    address1: signupSession.get("address1"),
    address2: signupSession.get("address2"),
    phoneNumber: signupSession.get("phoneNumber"),
  };

  // validation
  const form = await validator.validate(data);
  if (form.error) return validationError(form.error);

  // encrypt password
  const crypto = require("crypto");
  const encryptedPassword = crypto
    .createHash("sha256")
    .update(signupSession.get("password"))
    .digest("base64");

  // insert user data to database
  try {
    const { data, error } = await db
      .from<definitions["users"]>("users")
      .insert([
        snakecaseKeys({
          email: signupSession.get("email"),
          password: encryptedPassword,
          lastName: signupSession.get("lastName"),
          firstName: signupSession.get("firstName"),
          lastNameKana: signupSession.get("lastNameKana"),
          firstNameKana: signupSession.get("firstNameKana"),
          postalCode: signupSession.get("postalCode"),
          prefecture: signupSession.get("prefecture"),
          city: signupSession.get("city"),
          address1: signupSession.get("address1"),
          address2: signupSession.get("address2"),
          phoneNumber: signupSession.get("phoneNumber"),
          deleteFlg: false,
        }),
      ]);

    if (data) {
      inserted = camelcaseKeys(data[0]);
    }

    if (error) {
      throw error;
    }
  } catch (error) {
    console.log(error);

    return validationError({
      fieldErrors: {
        system: "dbWrite",
      },
    });
  }

  // create user's site settings data in database
  const settingsSession = await getSettingsSession(
    request.headers.get("Cookie")
  );
  const settings: SettingsType = settingsSession.get("settings");

  try {
    const { error } = await db
      .from<definitions["settings"]>("settings")
      .insert([
        snakecaseKeys({
          userId: inserted?.id,
          darkMode:
            settings.darkMode === "light"
              ? MODE_LIGHT
              : settings.darkMode === "dark"
              ? MODE_DARK
              : MODE_SYSTEM,
          language: settings.lang,
        }),
      ]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.log(error);

    return validationError({
      fieldErrors: {
        system: "dbWrite",
      },
    });
  }

  // save user data to auth session
  const authSession = await getAuthSession(request.headers.get("Cookie"));
  authSession.set("id", inserted?.id);
  authSession.set("email", inserted?.email);
  authSession.set("password", inserted?.password);
  authSession.set("lastName", inserted?.lastName);
  authSession.set("firstName", inserted?.firstName);

  // destroy signup session and commit auth session
  const headers = new Headers();
  headers.append("Set-Cookie", await destroySignupSession(signupSession));
  headers.append("Set-Cookie", await commitAuthSession(authSession));

  return redirect("/front/signup/complete", { headers });
};

export default function Confirm() {
  const [progress, setProgress] = useState(false);
  const { handleChangeStep } = useStep();
  const formData = useLoaderData<typeof loader>();
  const validated = useActionData<typeof action>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const transition = useTransition();

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

  useEffect(() => {
    if (validated) {
      setProgress(false);
    }
  }, [validated]);

  const handleSend = () => {
    setProgress(true);
  };

  return (
    <>
      <Form replace method="post">
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

        {transition.state !== "submitting" &&
          validated &&
          Object.entries(validated.fieldErrors).map(([key, value], index) => (
            <Alert key={index} severity="error">
              {t(`front:${key}`)}: {t(`validator:${value}`)}
            </Alert>
          ))}

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
            <MyLinkButton
              variant="outlined"
              to="../"
              disabled={transition.state === "submitting"}
              sx={{ mr: 3 }}
            >
              {t("common:back")}
            </MyLinkButton>
            <MySubmitButton
              label="send"
              onClick={handleSend}
              sx={{ mr: 3 }}
              endIcon={<SendIcon />}
            />
          </Box>
        </Box>
      </Form>
    </>
  );
}

import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Button,
  Divider,
  Link as MUILink,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as RemixLink, useActionData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { blue } from "@mui/material/colors";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { signinSchema } from "~/stores/validator";
import { withYup } from "@remix-validated-form/with-yup";
import {
  useIsSubmitting,
  ValidatedForm,
  validationError,
} from "remix-validated-form";
import { MySubmitButton } from "~/components/atoms/MySubmitButton";
import { MyTextField } from "~/components/atoms/MyTextField";
import { MyPassword } from "~/components/atoms/MyPassword";
import {
  commitSession as commitAuthSession,
  getSession as getAuthSession,
} from "~/utils/sessions/auth.server";
import {
  commitSession as commitNoticeSession,
  getSession as getNoticeSession,
} from "~/utils/sessions/notice.server";

const validator = withYup(signinSchema);

export const loader = async ({ request }: LoaderArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/front",
  });
};

export const action = async ({ request }: ActionArgs) => {
  let user;

  try {
    user = await authenticator.authenticate("form", request);
  } catch (error) {
    return validationError({
      fieldErrors: {
        auth: "signinFailed",
      },
    });
  }

  if (user) {
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get("r");

    // manually get the session and store the user data
    const authSession = await getAuthSession(request.headers.get("cookie"));
    authSession.set(authenticator.sessionKey, user);

    // to show snackbar of successful sign-in
    const noticeSession = await getNoticeSession(request.headers.get("cookie"));
    noticeSession.flash("notice", "signin");

    const headers = new Headers();
    headers.append("Set-Cookie", await commitAuthSession(authSession));
    headers.append("Set-Cookie", await commitNoticeSession(noticeSession));

    return redirect(redirectTo || "/front", { headers });
  }

  return validationError({
    fieldErrors: {
      system: "db",
    },
  });
};

export default function Signin() {
  const validated = useActionData<typeof action>();
  const isSubmitting = useIsSubmitting("myForm");
  const { t } = useTranslation();

  return (
    <ValidatedForm validator={validator} method="post" id="myForm">
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("common:signin")}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <MyTextField
              label="email"
              autoComplete="email"
              defaultValue=""
              autoFocus
              fullWidth
              required
            />

            <MyPassword
              label="password"
              defaultValue=""
              sx={{ mt: 2 }}
              required
            />

            {!isSubmitting &&
              validated &&
              Object.entries(validated?.fieldErrors).map(
                ([key, value], index) => {
                  if (key === "system") {
                    return (
                      <Alert key={index} severity="error" sx={{ mt: 2 }}>
                        {t(`validator:${key}`)}: {t(`validator:${value}`)}
                      </Alert>
                    );
                  } else if (key === "auth") {
                    return (
                      <Alert key={index} severity="error" sx={{ mt: 2 }}>
                        {t(`validator:${value}`)}
                      </Alert>
                    );
                  }
                  return "";
                }
              )}

            <MySubmitButton
              label="signin"
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              fullWidth
            />

            <Divider>
              <Typography variant="subtitle2" sx={{ ml: 1, mr: 1 }}>
                or
              </Typography>
            </Divider>

            <Button
              component={RemixLink}
              to={"/front/signup"}
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
              fullWidth
            >
              {t("common:create_new_account")}
            </Button>

            <Box sx={{ textAlign: "right" }}>
              <MUILink
                to="#"
                component={RemixLink}
                color={blue[500]}
                underline="hover"
                variant="subtitle2"
              >
                {t("common:forget_password")}
              </MUILink>
            </Box>
          </Box>
        </Box>
      </Container>
    </ValidatedForm>
  );
}

import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Button,
  Divider,
  Link as MUILink,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Link as RemixLink,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { blue } from "@mui/material/colors";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { signinSchema } from "~/stores/validator";
import { withYup } from "@remix-validated-form/with-yup";
import { ValidatedForm } from "remix-validated-form";
import { MySubmitButton } from "~/components/atoms/MySubmitButton";
import { MyTextField } from "~/components/atoms/MyTextField";
import {
  commitSession as commitAlertSession,
  getSession as getAlertSession,
} from "~/utils/sessions/alert.server";
import {
  commitSession as commitAuthSession,
  getSession as getAuthSession,
} from "~/utils/sessions/auth.server";
import {
  commitSession as commitNoticeSession,
  getSession as getNoticeSession,
} from "~/utils/sessions/notice.server";
import { MyLinkButton } from "~/components/atoms/MyLinkButton";
import type { NoticeType, PasswordFieldHandler } from "~/types/outline";
import { useRef, useEffect } from "react";
import MyPassword from "~/components/atoms/MyPassword";
import MyAlert from "~/components/atoms/MyAlert";

const validator = withYup(signinSchema);

export const loader = async ({ request }: LoaderArgs) => {
  const authUser = await authenticator.isAuthenticated(request);

  if (authUser) {
    return redirect("/front");
  }

  const alertSession = await getAlertSession(request.headers.get("Cookie"));
  const alert: NoticeType = alertSession.get("alert");

  return json(
    { alert },
    {
      headers: {
        "Set-Cookie": await commitAlertSession(alertSession),
      },
    }
  );
};

export const action = async ({ request }: ActionArgs) => {
  let user;
  const alertSession = await getAlertSession(request.headers.get("cookie"));

  try {
    user = await authenticator.authenticate("form", request);
  } catch (error) {
    // show alert of sign-in failure
    alertSession.flash("alert", { key: "signinFailed" });

    return redirect(request.url, {
      headers: {
        "Set-Cookie": await commitAlertSession(alertSession),
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
    noticeSession.flash("notice", { key: "signin" });

    const headers = new Headers();
    headers.append("Set-Cookie", await commitAuthSession(authSession));
    headers.append("Set-Cookie", await commitNoticeSession(noticeSession));

    return redirect(redirectTo || "/front", { headers });
  }

  // show alert of database error
  alertSession.flash("alert", { key: "db" });

  return redirect(request.url, {
    headers: {
      "Set-Cookie": await commitAlertSession(alertSession),
    },
  });
};

export default function Signin() {
  const { alert } = useLoaderData<typeof loader>();
  const transition = useTransition();
  const passwordFieldRef = useRef({} as PasswordFieldHandler);
  const { t } = useTranslation();

  useEffect(() => {
    if (transition.state === "idle") {
      passwordFieldRef.current.reset();
    }
  }, [transition.state]);

  return (
    <>
      {/* show errors with alert */}
      <MyAlert i18nObj={alert} />

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
                onValidate="submit"
                autoFocus
                fullWidth
                required
              />

              <MyPassword
                ref={passwordFieldRef}
                label="password"
                defaultValue=""
                onValidate="submit"
                sx={{ mt: 2 }}
                required
              />

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

              <Button></Button>

              <MyLinkButton
                to={"/front/signup"}
                variant="contained"
                color="success"
                sx={{ mt: 3, mb: 2 }}
                fullWidth
              >
                {t("common:create_new_account")}
              </MyLinkButton>

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
    </>
  );
}

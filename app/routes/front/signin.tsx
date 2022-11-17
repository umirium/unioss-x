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
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
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
  commitSession as commitCartSession,
  getSession as getCartSession,
} from "~/utils/sessions/cart.server";
import {
  commitSession as commitNoticeSession,
  getSession as getNoticeSession,
} from "~/utils/sessions/notice.server";
import {
  commitSession as commitSettingsSession,
  getSession as getSettingsSession,
} from "~/utils/sessions/settings.server";
import { MyLinkButton } from "~/components/atoms/MyLinkButton";
import type {
  NoticeType,
  PasswordFieldHandler,
  SettingsType,
} from "~/types/outline";
import { useRef, useEffect } from "react";
import MyPassword from "~/components/atoms/MyPassword";
import MyAlert from "~/components/atoms/MyAlert";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";
import type { SnakeToCamel } from "snake-camel-types";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import { MODE_DARK, MODE_LIGHT } from "~/utils/constants/index.server";

const validator = withYup(signinSchema);

export const meta: MetaFunction<typeof loader> = ({ parentsData }) => {
  return {
    title: `${parentsData["routes/front"].siteTitle} | sign-in`,
  };
};

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
  let user: SnakeToCamel<definitions["users"]> | null;
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

  if (!user) {
    // show alert of database error
    alertSession.flash("alert", { key: "db" });

    return redirect(request.url, {
      headers: {
        "Set-Cookie": await commitAlertSession(alertSession),
      },
    });
  }

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("r");

  // manually get the session and store the user data
  const authSession = await getAuthSession(request.headers.get("cookie"));
  authSession.set(authenticator.sessionKey, user);

  // show snackbar of successful sign-in
  const noticeSession = await getNoticeSession(request.headers.get("cookie"));
  noticeSession.flash("notice", { key: "signin" });

  // load user's site settings
  const settingsSession = await getSettingsSession(
    request.headers.get("Cookie")
  );

  /**
   * merge session and database cart data
   */
  let cartDB: Array<SnakeToCamel<definitions["carts"]>> | undefined = undefined;

  // get cart data from database
  try {
    const { data, error } = await db
      .from<definitions["carts"]>("carts")
      .select("*")
      .eq("user_id", user.id)
      .eq("delete_flg", false);

    if (error) {
      console.log(error);
      throw new Error("read");
    }

    cartDB = camelcaseKeys(data);
  } catch (error) {
    // show alert of database errors
    if (error instanceof Error) {
      alertSession.flash("alert", {
        key: `dbErrors_${Date.now()}`,
        options: { error: `common:${error.message}` },
      });
    } else {
      alertSession.flash("alert", {
        key: `unknown_${Date.now()}`,
      });
    }

    return redirect(request.url, {
      headers: {
        "Set-Cookie": await commitAlertSession(alertSession),
      },
    });
  }

  // get cart data from cookie
  const cartSession = await getCartSession(request.headers.get("Cookie"));
  const cart: Array<
    Pick<SnakeToCamel<definitions["carts"]>, "productId" | "quantity">
  > = cartSession.get("cart") || [];

  // update DB
  const upserter = cart?.map((item) => {
    const extract = cartDB?.find((e) => e.productId === item.productId);

    // update
    if (extract) {
      return {
        id: extract.id,
        userId: user?.id,
        productId: item.productId,
        quantity: item.quantity + extract.quantity,
      };
    }

    // insert
    return { id: null, userId: user?.id, ...item };
  });

  if (upserter) {
    try {
      const { error } = await db
        .from("carts")
        .upsert(snakecaseKeys(upserter))
        .select();

      if (error) {
        console.log(error);
        throw new Error("upsert");
      }
    } catch (error: Error | unknown) {
      // show alert of database errors
      const alertSession = await getAlertSession(request.headers.get("cookie"));

      if (error instanceof Error) {
        alertSession.flash("alert", {
          key: `dbErrors_${Date.now()}`,
          options: { error: `common:${error.message}` },
        });
      } else {
        alertSession.flash("alert", {
          key: `unknown_${Date.now()}`,
        });
      }

      return redirect(request.url, {
        headers: {
          "Set-Cookie": await commitAlertSession(alertSession),
        },
      });
    }
  }

  // update cart
  const newCart = [...cart];

  cartDB.forEach((item) => {
    const index = cart?.findIndex((e) => e.productId === item.productId);

    if (index !== -1) {
      newCart[index].quantity += item.quantity;
      return;
    }

    newCart?.push({
      productId: item.productId,
      quantity: item.quantity,
    });
  });

  cartSession.set("cart", newCart);

  /**
   * load site settings data from database
   */
  let settingsDB: SnakeToCamel<definitions["settings"]> | undefined = undefined;

  try {
    const { data, error } = await db
      .from<definitions["settings"]>("settings")
      .select("*")
      .eq("user_id", user.id)
      .eq("delete_flg", false)
      .single();

    if (error) {
      console.log(error);
      throw new Error("read");
    }

    settingsDB = camelcaseKeys(data);
  } catch (error) {
    // show alert of database errors
    if (error instanceof Error) {
      alertSession.flash("alert", {
        key: `dbErrors_${Date.now()}`,
        options: { error: `common:${error.message}` },
      });
    } else {
      alertSession.flash("alert", {
        key: `unknown_${Date.now()}`,
      });
    }
  }

  let settings: SettingsType = settingsSession.get("settings");

  if (settingsDB) {
    settings.darkMode =
      settingsDB.darkMode === MODE_LIGHT
        ? "light"
        : settingsDB.darkMode === MODE_DARK
        ? "dark"
        : "system";
    settings.language =
      settingsDB.language === "en" || settingsDB.language === "ja"
        ? settingsDB.language
        : settings.language;
  }

  settingsSession.set("settings", settings);

  const headers = new Headers();
  headers.append("Set-Cookie", await commitAuthSession(authSession));
  headers.append("Set-Cookie", await commitCartSession(cartSession));
  headers.append("Set-Cookie", await commitNoticeSession(noticeSession));
  headers.append("Set-Cookie", await commitSettingsSession(settingsSession));

  return redirect(redirectTo || "/front", { headers });
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

            <Box sx={{ mt: 5 }}>
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

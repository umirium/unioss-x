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
import { Link as RemixLink, useTransition } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { blue } from "@mui/material/colors";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
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
import type { PasswordFieldHandler, SettingsType } from "~/types/outline";
import { useRef, useEffect } from "react";
import MyPassword from "~/components/atoms/MyPassword";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";
import type { SnakeToCamel } from "snake-camel-types";
import snakecaseKeys from "snakecase-keys";
import { MODE_DARK, MODE_LIGHT } from "~/utils/constants/index.server";
import query from "~/utils/query.server";

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

  return null;
};

export const action = async ({ request }: ActionArgs) => {
  let user: SnakeToCamel<definitions["users"]> | null;
  const noticeSession = await getNoticeSession(request.headers.get("cookie"));

  try {
    user = await authenticator.authenticate("form", request);
  } catch (error) {
    // show notice of sign-in failure
    noticeSession.flash("notice", { key: "signinFailed", isAlert: true });

    const headers = new Headers();
    headers.append("Set-Cookie", await commitNoticeSession(noticeSession));

    return redirect(request.url, { headers });
  }

  if (!user) {
    // show alert of database error
    const alertSession = await getAlertSession(request.headers.get("cookie"));

    alertSession.flash("alert", { key: "authProc" });

    const headers = new Headers();
    headers.append("Set-Cookie", await commitAlertSession(alertSession));

    return redirect(request.url, { headers });
  }

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("r");

  // manually get the session and store the user data
  const authSession = await getAuthSession(request.headers.get("cookie"));
  authSession.set(authenticator.sessionKey, user);

  /**
   * merge session and database cart data
   */
  // get cart data from database
  const cartDB = await query(
    () =>
      db
        .from<definitions["carts"]>("carts")
        .select("*")
        .eq("user_id", user?.id || "")
        .eq("delete_flg", false),
    request
  );

  if (cartDB.err) {
    return cartDB.err;
  }

  // get cart data from cookie
  const cartSession = await getCartSession(request.headers.get("Cookie"));
  const cart: Array<
    Pick<SnakeToCamel<definitions["carts"]>, "productId" | "quantity">
  > = cartSession.get("cart") || [];

  // update DB
  const upserter = cart?.map((item) => {
    const extract = cartDB.data.find((e) => e.productId === item.productId);

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
    const { err } = await query(
      () => db.from("carts").upsert(snakecaseKeys(upserter)).select(),
      request
    );

    if (err) {
      return err;
    }
  }

  // update cart
  const newCart = [...cart];

  cartDB.data.forEach((item) => {
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
  const settingsDB = await query(
    () =>
      db
        .from<definitions["settings"]>("settings")
        .select("*")
        .eq("user_id", user?.id || "")
        .eq("delete_flg", false)
        .limit(1),
    request
  );

  if (settingsDB.err) {
    return settingsDB.err;
  }

  // load user's site settings
  const settingsSession = await getSettingsSession(
    request.headers.get("Cookie")
  );
  let settings: SettingsType = settingsSession.get("settings");

  if (settingsDB.data.length !== 0) {
    const settingDB = settingsDB.data[0];

    settings.darkMode =
      settingDB.darkMode === MODE_LIGHT
        ? "light"
        : settingDB.darkMode === MODE_DARK
        ? "dark"
        : "system";
    settings.language =
      settingDB.language === "en" || settingDB.language === "ja"
        ? settingDB.language
        : settings.language;
  }

  settingsSession.set("settings", settings);

  // show snackbar of successful sign-in
  noticeSession.flash("notice", { key: "signin" });

  const headers = new Headers();
  headers.append("Set-Cookie", await commitAuthSession(authSession));
  headers.append("Set-Cookie", await commitCartSession(cartSession));
  headers.append("Set-Cookie", await commitNoticeSession(noticeSession));
  headers.append("Set-Cookie", await commitSettingsSession(settingsSession));

  return redirect(redirectTo || "/front", { headers });
};

export default function Signin() {
  const transition = useTransition();
  const passwordFieldRef = useRef({} as PasswordFieldHandler);
  const { t } = useTranslation();

  useEffect(() => {
    if (transition.state === "idle") {
      passwordFieldRef.current.reset();
    }
  }, [transition.state]);

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
  );
}

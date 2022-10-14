import type { SnakeToCamel } from "snake-camel-types";
import camelcaseKeys from "camelcase-keys";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import type { definitions } from "~/types/tables";
import { sessionStrage } from "~/utils/sessions/auth.server";
import { db } from "./db.server";

export const signin = async (email: string, encryptedPassword: string) => {
  const { data } = await db
    .from<definitions["users"]>("users")
    .select("id, email, last_name, first_name")
    .eq("email", email)
    .eq("password", encryptedPassword)
    .eq("delete_flg", false)
    .single();

  return data ? camelcaseKeys(data) : data;
};

export const authenticator = new Authenticator<SnakeToCamel<
  definitions["users"]
> | null>(sessionStrage);

authenticator.use(
  new FormStrategy(async ({ form: formData }) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // encrypt password
    const crypto = require("crypto");
    const encryptedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("base64");

    const user = await signin(email, encryptedPassword);

    if (user) {
      return user;
    }

    throw new AuthorizationError(`User with email ${email} not yet registered`);
  }),
  "form"
);

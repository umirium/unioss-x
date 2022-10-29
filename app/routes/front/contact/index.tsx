import { Alert } from "@mui/material";
import { useEffect } from "react";
import { useStep } from "../contact";
import { useActionData, useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { withYup } from "@remix-validated-form/with-yup";
import { contactPersonalSchema } from "~/stores/validator";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { contactCookie } from "~/utils/cookies.server";
import { t } from "i18next";
import PersonalDataForm from "~/components/personalDataForm";

const validator = withYup(contactPersonalSchema);

export const loader = async ({ request }: LoaderArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await contactCookie.parse(cookieHeader)) || {};

  return cookie;
};

export const action = async ({ request }: ActionArgs) => {
  // for test
  // await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000));

  // validation
  const form = await validator.validate(await request.formData());
  if (form.error) return validationError(form.error);

  // session (cookie)
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await contactCookie.parse(cookieHeader)) || {};

  return redirect("/front/contact/inquiry", {
    headers: {
      "Set-Cookie": await contactCookie.serialize({ ...cookie, ...form.data }),
    },
  });
};

export default function Index() {
  const { handleChangeStep } = useStep();
  const formData = useLoaderData<typeof loader>();
  const validated = useActionData<typeof action>();

  // set Stepper
  useEffect(() => {
    handleChangeStep(0);
  });

  return (
    <>
      {validated &&
        Object.entries(validated.fieldErrors).map(([key, value], index) => {
          // show only system error
          if (key === "system") {
            return (
              <Alert key={index} severity="error">
                {`${t(`validator:${key}`)}: ${t(`validator:${value}`)}`}
              </Alert>
            );
          }
          return "";
        })}

      <PersonalDataForm
        isRegist={false}
        formData={formData}
        validator={validator}
      />
    </>
  );
}

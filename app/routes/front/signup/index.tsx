import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withYup } from "@remix-validated-form/with-yup";
import { useEffect } from "react";
import { validationError } from "remix-validated-form";
import PersonalDataForm from "~/components/personalDataForm";
import { personalDataFormSchema } from "~/stores/validator";
import type { PersonalData } from "~/types/contactFormType";
import { commitSession, getSession } from "~/utils/sessions/signup";
import { useStep } from "../signup";

const validator = withYup(personalDataFormSchema);

export const loader = async ({ request }: LoaderArgs) => {
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

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const action: ActionFunction = async ({ request }) => {
  // for test
  // await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000));

  // validation
  const form = await validator.validate(await request.formData());
  if (form.error) return validationError(form.error);

  // save form data to session
  const session = await getSession(request.headers.get("Cookie"));

  session.set("email", form.data.email);
  session.set("emailRetype", form.data.emailRetype);
  session.set("password", form.data.password);
  session.set("passwordRetype", form.data.passwordRetype);
  session.set("lastName", form.data.lastName);
  session.set("firstName", form.data.firstName);
  session.set("lastNameKana", form.data.lastNameKana);
  session.set("firstNameKana", form.data.firstNameKana);
  session.set("postalCode", form.data.postalCode);
  session.set("prefecture", form.data.prefecture);
  session.set("city", form.data.city);
  session.set("address1", form.data.address1);
  session.set("address2", form.data.address2);
  session.set("phoneNumber", form.data.phoneNumber);

  return redirect("/front/signup/confirm", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Index() {
  const formData = useLoaderData<typeof loader>();
  const { handleChangeStep } = useStep();

  // set Stepper
  useEffect(() => {
    handleChangeStep(0);
  });

  return (
    <PersonalDataForm
      isRegist={true}
      formData={formData}
      validator={validator}
    />
  );
}

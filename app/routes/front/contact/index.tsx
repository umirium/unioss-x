import { Alert, Box, FormControl } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect } from "react";
import { useStep } from "../contact";
import { useActionData, useLoaderData } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";
import { withYup } from "@remix-validated-form/with-yup";
import { contactPersonalSchema } from "~/stores/validator";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/utils/sessions/contact.server";
import { t } from "i18next";
import type { ContactPersonalInfoType } from "~/types/contactFormType";
import { MySelect } from "~/components/atoms/MySelect";
import { MySubmitButton } from "~/components/atoms/MySubmitButton";
import { MyTextField } from "~/components/atoms/MyTextField";
import prefectures from "~/stores/prefectures";

const validator = withYup(contactPersonalSchema);

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const data: ContactPersonalInfoType = {
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
  };

  return data;
};

export const action = async ({ request }: ActionArgs) => {
  // for test
  // await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000));

  // validation
  const form = await validator.validate(await request.formData());
  if (form.error) return validationError(form.error);

  const session = await getSession(request.headers.get("Cookie"));

  session.set("email", form.data.email);
  session.set("emailRetype", form.data.emailRetype);
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

  const headers = new Headers();
  headers.append("Set-Cookie", await commitSession(session));

  return redirect("/front/contact/inquiry", { headers });
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

      <ValidatedForm validator={validator} method="post">
        <Box sx={{ maxWidth: 800, m: "auto" }}>
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <MyTextField
                  label="email"
                  defaultValue={formData.email}
                  required
                />
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <MyTextField
                  label="emailRetype"
                  defaultValue={formData.emailRetype}
                  required
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 5 }}>
            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <MyTextField
                  label="lastName"
                  defaultValue={formData.lastName}
                  required
                />
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <MyTextField
                  label="firstName"
                  defaultValue={formData.firstName}
                  required
                />
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <MyTextField
                  label="lastNameKana"
                  defaultValue={formData.lastNameKana}
                  required
                />
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <MyTextField
                  label="firstNameKana"
                  defaultValue={formData.firstNameKana}
                  required
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <MyTextField
                  label="postalCode"
                  defaultValue={formData.postalCode}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid xs={12} sm={6} md={6}>
              <MySelect
                label="prefecture"
                defaultValue={formData.prefecture}
                menuItems={prefectures}
                fullWidth
              />
            </Grid>

            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <MyTextField label="city" defaultValue={formData.city} />
              </FormControl>
            </Grid>

            <Grid xs={12} sm={12} md={12}>
              <FormControl fullWidth>
                <MyTextField
                  label="address1"
                  defaultValue={formData.address1}
                />
              </FormControl>
            </Grid>

            <Grid xs={12} sm={12} md={12}>
              <FormControl fullWidth>
                <MyTextField
                  label="address2"
                  defaultValue={formData.address2}
                />
              </FormControl>
            </Grid>

            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <MyTextField
                  label="phoneNumber"
                  defaultValue={formData.phoneNumber}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 5, textAlign: "center" }}>
            <MySubmitButton label="next" />
          </Box>
        </Box>
      </ValidatedForm>
    </>
  );
}

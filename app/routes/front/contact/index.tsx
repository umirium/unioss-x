import { Grid, FormControl, Box } from "@mui/material";
import { useEffect } from "react";
import { useStep } from "../contact";
import prefectures from "~/stores/prefectures";
import { useLoaderData } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";
import { withYup } from "@remix-validated-form/with-yup";
import { contactPersonalInfoSchema } from "~/stores/validator";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { MyTextField } from "~/components/atoms/MyTextField";
import { MySubmitButton } from "~/components/atoms/MySubmitButton";
import { MySelect } from "~/components/atoms/MySelect";
import { contactCookie } from "~/utils/cookies";
import type { ContactPersonalInfoType } from "~/types/contactFormType";

const validator = withYup(contactPersonalInfoSchema);

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await contactCookie.parse(cookieHeader)) || {};

  return json(cookie);
};

export const action: ActionFunction = async ({ request }) => {
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
  const formData = useLoaderData<ContactPersonalInfoType>();

  // set Stepper
  useEffect(() => {
    handleChangeStep(0);
  });

  return (
    <ValidatedForm validator={validator} method="post">
      <Box sx={{ maxWidth: 800, m: "auto" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="yourName"
                defaultValue={formData?.yourName}
                required
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="kana"
                defaultValue={formData?.kana}
                required
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="email"
                defaultValue={formData?.email}
                required
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="emailRetype"
                defaultValue={formData?.emailRetype}
                required
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="phoneNumber"
                defaultValue={formData?.phoneNumber}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="postalCode"
                defaultValue={formData?.postalCode}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MySelect
                label="prefecture"
                defaultValue={formData?.prefecture}
                menuItems={prefectures}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField label="city" defaultValue={formData?.city} />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <FormControl fullWidth>
              <MyTextField label="address1" defaultValue={formData?.address1} />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <FormControl fullWidth>
              <MyTextField label="address2" defaultValue={formData?.address2} />
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 5, textAlign: "center" }}>
          <MySubmitButton label="next" />
        </Box>
      </Box>
    </ValidatedForm>
  );
}

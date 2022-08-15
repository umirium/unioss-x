import { Grid, FormControl, Box, Alert } from "@mui/material";
import { useEffect } from "react";
import { useStep } from "../contact";
import prefectures from "~/stores/prefectures";
import { useActionData } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";
import { withYup } from "@remix-validated-form/with-yup";
import { contactPersonalInfoSchema } from "~/stores/validator";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { MyTextField } from "~/components/atoms/MyTextField";
import { MySubmitButton } from "~/components/atoms/MySubmitButton";
import { MySelect } from "~/components/atoms/MySelect";

const validator = withYup(contactPersonalInfoSchema);

export const action: ActionFunction = async ({ request }) => {
  const data = await validator.validate(await request.formData());
  if (data.error) return validationError(data.error);
  const { email } = data.data;

  return json({
    title: `Hi!`,
    description: `Your email is ${email}`,
  });
};

export default function Index() {
  const { handleChangeStep } = useStep();
  const data = useActionData();

  // set Stepper
  useEffect(() => {
    handleChangeStep(0);
  });

  return (
    <ValidatedForm replace validator={validator} method="post">
      <Box sx={{ maxWidth: 800, m: "auto" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField name="yourName" required />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField name="kana" required />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField name="email" required />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField name="emailRetype" required />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField name="phoneNumber" />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField name="postalCode" />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MySelect name="prefecture" menuItems={prefectures} />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField name="city" />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <FormControl fullWidth>
              <MyTextField name="address1" />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <FormControl fullWidth>
              <MyTextField name="address2" />
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 5, textAlign: "center" }}>
          {data && (
            <Alert variant="standard" title={data.title}>
              {data.description}
            </Alert>
          )}

          <MySubmitButton />
        </Box>
      </Box>
    </ValidatedForm>
  );
}

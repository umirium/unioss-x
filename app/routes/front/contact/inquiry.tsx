import { Grid, FormControl, Box, Button } from "@mui/material";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { withYup } from "@remix-validated-form/with-yup";
import { useEffect } from "react";
import type { TFunction } from "react-i18next";
import { useTranslation } from "react-i18next";
import { ValidatedForm, validationError } from "remix-validated-form";
import { MySelect } from "~/components/atoms/MySelect";
import { MySubmitButton } from "~/components/atoms/MySubmitButton";
import { MyTextField } from "~/components/atoms/MyTextField";
import { contactInquirySchema } from "~/stores/validator";
import { contactCookie } from "~/utils/cookies";
import { useStep } from "../contact";

const validator = withYup(contactInquirySchema);

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
  console.log(form.data);

  return redirect("/front/contact/confirm", {
    headers: {
      "Set-Cookie": await contactCookie.serialize({ ...cookie, ...form.data }),
    },
  });
};

export default function Inquiry() {
  const { handleChangeStep } = useStep();
  const formData = useLoaderData();
  const { t } = useTranslation();

  // set Stepper
  useEffect(() => {
    handleChangeStep(1);
  });

  const categories = (t: TFunction<"front">) => [
    {
      value: 1,
      label: t("front:aboutThisWebSite"),
    },
    {
      value: 2,
      label: t("front:aboutProducts"),
    },
    {
      value: 3,
      label: t("front:aboutAccess"),
    },
    {
      value: 4,
      label: t("front:other"),
    },
  ];

  return (
    <ValidatedForm validator={validator} method="post">
      <Box sx={{ maxWidth: 800, m: "auto" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <FormControl fullWidth>
              <MySelect
                label="category"
                defaultValue={formData?.category}
                menuItems={categories}
                required
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="productName"
                defaultValue={formData?.productName}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="orderCode"
                defaultValue={formData?.orderCode}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <FormControl fullWidth>
              <MyTextField
                label="inquiry"
                defaultValue={formData?.inquiry}
                multiline
                rows={10}
                required
              />
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 5, textAlign: "center" }}>
          <Button variant="outlined" component={Link} to="../" sx={{ mr: 3 }}>
            {t("back")}
          </Button>

          <MySubmitButton label="next" name="action" value="next" />
        </Box>
      </Box>
    </ValidatedForm>
  );
}

import { Grid, FormControl, Box } from "@mui/material";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withYup } from "@remix-validated-form/with-yup";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ValidatedForm, validationError } from "remix-validated-form";
import { MyLinkButton } from "~/components/atoms/MyLinkButton";
import { MySelect } from "~/components/atoms/MySelect";
import { MySubmitButton } from "~/components/atoms/MySubmitButton";
import { MyTextField } from "~/components/atoms/MyTextField";
import { categories } from "~/stores/contact";
import { contactInquirySchema } from "~/stores/validator";
import type { ContactInquiryType } from "~/types/contactFormType";
import { commitSession, getSession } from "~/utils/sessions/contact.server";
import { useStep } from "../contact";

const validator = withYup(contactInquirySchema);

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const data: ContactInquiryType = {
    category: session.get("category"),
    productName: session.get("productName"),
    orderCode: session.get("orderCode"),
    inquiry: session.get("inquiry"),
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

  session.set("category", form.data.category);
  session.set("productName", form.data.productName);
  session.set("orderCode", form.data.orderCode);
  session.set("inquiry", form.data.inquiry);

  const headers = new Headers();
  headers.append("Set-Cookie", await commitSession(session));

  return redirect("/front/contact/confirm", { headers });
};

export default function Inquiry() {
  const { handleChangeStep } = useStep();
  const formData = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  // set Stepper
  useEffect(() => {
    handleChangeStep(1);
  });

  return (
    <ValidatedForm validator={validator} method="post">
      <Box sx={{ maxWidth: 800, m: "auto" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <MySelect
              label="category"
              defaultValue={formData?.category}
              menuItems={categories}
              fullWidth
              required
            />
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
          <MyLinkButton variant="outlined" to="../" sx={{ mr: 3 }}>
            {t("back")}
          </MyLinkButton>

          <MySubmitButton label="next" />
        </Box>
      </Box>
    </ValidatedForm>
  );
}

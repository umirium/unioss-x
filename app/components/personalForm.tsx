import { Box, FormControl } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import type { Validator } from "remix-validated-form";
import { ValidatedForm } from "remix-validated-form";
import prefectures from "~/stores/prefectures";
import type { ContactPersonalInfoType } from "~/types/contactFormType";
import { MySelect } from "./atoms/MySelect";
import { MySubmitButton } from "./atoms/MySubmitButton";
import { MyTextField } from "./atoms/MyTextField";

interface Props {
  isRegist: boolean;
  formData: ContactPersonalInfoType;
  validator: Validator<ContactPersonalInfoType>;
}

export default function PersonalForm(props: Props) {
  return (
    <ValidatedForm validator={props.validator} method="post">
      <Box sx={{ maxWidth: 800, m: "auto" }}>
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="email"
                defaultValue={props.formData?.email}
                required
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="emailRetype"
                defaultValue={props.formData?.emailRetype}
                required
              />
            </FormControl>
          </Grid>

          {props.isRegist && (
            <>
              <Grid xs={12} sm={6} md={6}>
                <FormControl fullWidth>
                  <MyTextField
                    label="password"
                    defaultValue={props.formData?.password}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6} md={6}>
                <FormControl fullWidth>
                  <MyTextField
                    label="passwordRetype"
                    defaultValue={props.formData?.passwordRetype}
                    required
                  />
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 5 }}>
          <Grid xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="yourName"
                defaultValue={props.formData?.yourName}
                required
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="kana"
                defaultValue={props.formData?.kana}
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
                defaultValue={props.formData?.postalCode}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MySelect
                label="prefecture"
                defaultValue={props.formData?.prefecture}
                menuItems={prefectures}
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField label="city" defaultValue={props.formData?.city} />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={12} md={12}>
            <FormControl fullWidth>
              <MyTextField
                label="address1"
                defaultValue={props.formData?.address1}
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={12} md={12}>
            <FormControl fullWidth>
              <MyTextField
                label="address2"
                defaultValue={props.formData?.address2}
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="phoneNumber"
                defaultValue={props.formData?.phoneNumber}
              />
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

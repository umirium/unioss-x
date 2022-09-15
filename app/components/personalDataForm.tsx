import { Box, FormControl } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import type { Validator } from "remix-validated-form";
import { ValidatedForm } from "remix-validated-form";
import prefectures from "~/stores/prefectures";
import type { PersonalData } from "~/types/contactFormType";
import { MySelect } from "./atoms/MySelect";
import { MySubmitButton } from "./atoms/MySubmitButton";
import { MyTextField } from "./atoms/MyTextField";

interface Props {
  isRegist: boolean;
  formData: PersonalData;
  validator: Validator<PersonalData>;
}

export default function personalDataForm(props: Props) {
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
                    type="password"
                    defaultValue={props.formData?.password}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid xs={12} sm={6} md={6}>
                <FormControl fullWidth>
                  <MyTextField
                    label="passwordRetype"
                    type="password"
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
                label="lastName"
                defaultValue={props.formData?.lastName}
                required
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="firstName"
                defaultValue={props.formData?.firstName}
                required
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="lastNameKana"
                defaultValue={props.formData?.lastNameKana}
                required
              />
            </FormControl>
          </Grid>

          <Grid xs={12} sm={6} md={6}>
            <FormControl fullWidth>
              <MyTextField
                label="firstNameKana"
                defaultValue={props.formData?.firstNameKana}
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

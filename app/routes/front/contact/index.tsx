import {
  Grid,
  FormControl,
  TextField,
  Button,
  Box,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStep } from "../contact";
import { contactPersonalInfoSchema } from "~/stores/validator";
import prefectures from "~/stores/prefectures";
import type { ContactPersonalInfoType } from "types/contactFormType";

export default function Index() {
  const { t } = useTranslation("front");
  const { t: ct } = useTranslation("common");
  const { t: vt } = useTranslation("validator");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactPersonalInfoType>({
    resolver: yupResolver(contactPersonalInfoSchema(vt)),
  });
  const { handleChangeStep } = useStep();

  // set Stepper
  useEffect(() => {
    handleChangeStep(0);
  });

  const onSubmit: SubmitHandler<ContactPersonalInfoType> = (data) => {
    console.log(data);
  };

  return (
    <Box sx={{ maxWidth: 800, m: "auto" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField
              label={`${t("yourName")} *`}
              variant="outlined"
              {...register("yourName")}
              error={"yourName" in errors}
              helperText={errors.yourName?.message}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField
              label={`${t("kana")} *`}
              variant="outlined"
              {...register("kana")}
              error={"kana" in errors}
              helperText={errors.kana?.message}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField
              label={`${t("email")} *`}
              variant="outlined"
              {...register("email")}
              error={"email" in errors}
              helperText={errors.email?.message}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField
              label={`${t("emailRetype")} *`}
              variant="outlined"
              {...register("emailRetype")}
              error={"emailRetype" in errors}
              helperText={errors.emailRetype?.message}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField
              label={t("phoneNumber")}
              variant="outlined"
              inputProps={{
                pattern: "\\d{1,5}-\\d{1,4}-\\d{4,5}",
              }}
              title="電話番号は、市外局番からハイフン（-）を入れて記入してください。"
              {...register("phoneNumber")}
              error={"phoneNumber" in errors}
              helperText={errors.phoneNumber?.message}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField
              label={t("postalCode")}
              variant="outlined"
              {...register("postalCode")}
              error={"postalCode" in errors}
              helperText={errors.postalCode?.message}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <InputLabel>{t("prefecture")}</InputLabel>
            <Select
              label={t("prefecture")}
              defaultValue=""
              {...register("prefecture")}
              error={"prefecture" in errors}
            >
              <MenuItem value="">
                <em>{ct("_pleaseSelect_")}</em>
              </MenuItem>

              {prefectures(ct).map((option, k) => (
                <MenuItem key={k} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.prefecture?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField
              label={t("city")}
              variant="outlined"
              {...register("city")}
              error={"city" in errors}
              helperText={errors.city?.message}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <FormControl fullWidth>
            <TextField
              label={t("address1")}
              variant="outlined"
              {...register("address1")}
              error={"address1" in errors}
              helperText={errors.address1?.message}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <FormControl fullWidth>
            <TextField
              label={t("address2")}
              variant="outlined"
              {...register("address2")}
              error={"address2" in errors}
              helperText={errors.address2?.message}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          // component={Link}
          // to="inquiry"
          onClick={handleSubmit(onSubmit)}
        >
          {ct("next")}
        </Button>
      </Box>
    </Box>
  );
}

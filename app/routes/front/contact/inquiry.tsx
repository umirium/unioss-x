import { yupResolver } from "@hookform/resolvers/yup";
import {
  Grid,
  FormControl,
  InputLabel,
  TextField,
  MenuItem,
  Box,
  Button,
  Select,
  FormHelperText,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { Link } from "@remix-run/react";
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { ContactInquiryType } from "types/contactFormType";
import { contactInquirySchema } from "~/stores/validator";
import { useStep } from "../contact";

export default function Inquiry() {
  const { handleChangeStep } = useStep();
  const { t } = useTranslation("front");
  const { t: ct } = useTranslation("common");
  const { t: vt } = useTranslation("validator");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInquiryType>({
    resolver: yupResolver(contactInquirySchema(vt)),
  });

  const categories = [
    {
      value: 1,
      label: t("aboutThisWebSite"),
    },
    {
      value: 2,
      label: t("aboutProducts"),
    },
    {
      value: 3,
      label: t("aboutAccess"),
    },
    {
      value: 4,
      label: t("other"),
    },
  ];

  // set Stepper
  useEffect(() => {
    handleChangeStep(1);
  });

  const onSubmit: SubmitHandler<ContactInquiryType> = (data) => {
    console.log(data);
  };

  return (
    <Box sx={{ maxWidth: 800, m: "auto" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <FormControl fullWidth>
            <InputLabel>{`${t("category")} *`}</InputLabel>
            <Select
              label={`${t("category")} *`}
              defaultValue=""
              {...register("category")}
              error={"category" in errors}
            >
              <MenuItem value="">
                <em>{ct("_pleaseSelect_")}</em>
              </MenuItem>

              {categories.map((option, k) => (
                <MenuItem key={k} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText sx={{ color: red[500] }}>
              {errors.category?.message}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField
              label={t("productName")}
              variant="outlined"
              {...register("productName")}
              error={"productName" in errors}
              helperText={errors.productName?.message}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField
              label={t("orderCode")}
              variant="outlined"
              {...register("orderCode")}
              error={"orderCode" in errors}
              helperText={errors.orderCode?.message}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <FormControl fullWidth>
            <TextField
              label={`${t("inquiry")} *`}
              multiline
              rows={10}
              {...register("inquiry")}
              error={"inquiry" in errors}
              helperText={errors.inquiry?.message}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Button variant="outlined" component={Link} to="../" sx={{ mr: 3 }}>
          {ct("back")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          // component={Link}
          // to="../confirm"
          onClick={handleSubmit(onSubmit)}
        >
          {ct("next")}
        </Button>
      </Box>
    </Box>
  );
}

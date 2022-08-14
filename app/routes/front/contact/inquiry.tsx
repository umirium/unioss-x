import {
  Grid,
  FormControl,
  InputLabel,
  TextField,
  MenuItem,
  Box,
  Button,
  Select,
} from "@mui/material";
import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStep } from "../contact";

export default function Inquiry() {
  const { handleChangeStep } = useStep();
  const { t } = useTranslation("front");
  const { t: ct } = useTranslation("common");

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

  return (
    <Box sx={{ maxWidth: 800, m: "auto" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <FormControl fullWidth>
            <InputLabel>{`${t("category")} *`}</InputLabel>
            <Select label={`${t("category")} *`} defaultValue="">
              <MenuItem value="">
                <em>{ct("_pleaseSelect_")}</em>
              </MenuItem>

              {categories.map((option, k) => (
                <MenuItem key={k} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField label={t("productName")} variant="outlined" />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField label={t("orderCode")} variant="outlined" />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <FormControl fullWidth>
            <TextField label={`${t("inquiry")} *`} multiline rows={10} />
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
          component={Link}
          to="../confirm"
        >
          {ct("next")}
        </Button>
      </Box>
    </Box>
  );
}

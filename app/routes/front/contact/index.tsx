import { Grid, FormControl, TextField, Button, Box } from "@mui/material";
import { Link } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStep } from "../contact";

export default function Index() {
  const [category, setCategory] = useState("EUR");
  const { handleChangeStep } = useStep();
  const { t } = useTranslation("front");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  // set Stepper
  useEffect(() => {
    handleChangeStep(0);
  });

  return (
    <Box sx={{ maxWidth: 800, m: "auto" }}>
      <Grid container spacing={3} sx={{ mt: 5 }}>
        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField label={t("your name")} variant="outlined" />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField label={t("kana")} variant="outlined" />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField label={t("email")} variant="outlined" />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField label={t("email retype")} variant="outlined" />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField
              label={t("phone number")}
              variant="outlined"
              inputProps={{
                pattern: "\\d{1,5}-\\d{1,4}-\\d{4,5}",
              }}
              title="電話番号は、市外局番からハイフン（-）を入れて記入してください。"
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField label={t("postal code")} variant="outlined" />
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField
              select
              label={t("prefecture")}
              value={category}
              onChange={handleChange}
            >
              {/* {prefectures.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))} */}
            </TextField>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField label={t("city")} variant="outlined" />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <FormControl fullWidth>
            <TextField label={t("address1")} variant="outlined" />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <FormControl fullWidth>
            <TextField label={t("address2")} variant="outlined" />
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="inquiry"
        >
          次へ
        </Button>
      </Box>
    </Box>
  );
}

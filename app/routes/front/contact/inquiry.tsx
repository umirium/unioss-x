import {
  Grid,
  FormControl,
  TextField,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import { Link } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStep } from "../contact";

export default function Inquiry() {
  const [category, setCategory] = useState("EUR");
  const { handleChangeStep } = useStep();
  const { t } = useTranslation("front");

  const categories = [
    {
      value: "1",
      label: t("about this web site"),
    },
    {
      value: "2",
      label: t("about products"),
    },
    {
      value: "3",
      label: t("about access"),
    },
    {
      value: "4",
      label: t("other"),
    },
  ];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value);
  };

  // set Stepper
  useEffect(() => {
    handleChangeStep(1);
  });

  return (
    <Box sx={{ maxWidth: 800, m: "auto" }}>
      <Grid container spacing={3} sx={{ mt: 5 }}>
        <Grid item xs={12} sm={12} md={12}>
          <FormControl fullWidth>
            <TextField
              select
              label={t("category")}
              value={category}
              onChange={handleChange}
            >
              {categories.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField label={t("product name")} variant="outlined" />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth>
            <TextField label={t("order code")} variant="outlined" />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <FormControl fullWidth>
            <TextField
              id="outlined-multiline-static"
              label={t("inquiry")}
              multiline
              rows={10}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Button variant="outlined" component={Link} to="../" sx={{ mr: 3 }}>
          戻る
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="../confirm"
        >
          次へ
        </Button>
      </Box>
    </Box>
  );
}

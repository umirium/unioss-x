import { Box, Button, Grid, Paper } from "@mui/material";
import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStep } from "../contact";

export default function Confirm() {
  const { handleChangeStep } = useStep();
  const { t } = useTranslation();

  // set Stepper
  useEffect(() => {
    handleChangeStep(2);
  });

  const posts = [
    {
      title: t("front:yourName"),
      value: "",
    },
    {
      title: t("front:kana"),
      value: "",
    },
    {
      title: t("front:email"),
      value: "",
    },
    {
      title: t("front:emailRetype"),
      value: "",
    },
    {
      title: t("front:phoneNumber"),
      value: "",
    },
    {
      title: t("front:postalCode"),
      value: "",
    },
    {
      title: t("front:prefecture"),
      value: "",
    },
    {
      title: t("front:city"),
      value: "",
    },
    {
      title: t("front:address1"),
      value: "",
    },
    {
      title: t("front:address2"),
      value: "",
    },
    {
      title: t("front:category"),
      value: "",
    },
    {
      title: t("front:productName"),
      value: "",
    },
    {
      title: t("front:orderCode"),
      value: "",
    },
    {
      title: t("front:inquiry"),
      value: "",
    },
  ];

  return (
    <Box sx={{ maxWidth: 800, m: "auto" }}>
      <Paper elevation={1} sx={{ pb: 2 }}>
        {posts.map((post, k) => (
          <Grid container key={k} spacing={3} sx={{ mt: 1, mb: 1 }}>
            <Grid xs={6} sm={6} md={6} sx={{ textAlign: "center" }} item>
              {post.title}
            </Grid>
            <Grid xs={6} sm={6} md={6} sx={{ textAlign: "center" }} item>
              {post.value}
            </Grid>
          </Grid>
        ))}
      </Paper>

      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Button
          variant="outlined"
          component={Link}
          to="../inquiry"
          sx={{ mr: 3 }}
        >
          {t("common:back")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="../complete"
        >
          {t("common:send")}
        </Button>
      </Box>
    </Box>
  );
}

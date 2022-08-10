import { Box, Button, Grid, Paper } from "@mui/material";
import { Link } from "@remix-run/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStep } from "../contact";

export default function Confirm() {
  const { handleChangeStep } = useStep();
  const { t } = useTranslation("front");
  const { t: ct } = useTranslation("common");

  // set Stepper
  useEffect(() => {
    handleChangeStep(2);
  });

  const posts = [
    {
      title: t("your name"),
      value: "",
    },
    {
      title: t("kana"),
      value: "",
    },
    {
      title: t("email"),
      value: "",
    },
    {
      title: t("email retype"),
      value: "",
    },
    {
      title: t("phone number"),
      value: "",
    },
    {
      title: t("postal code"),
      value: "",
    },
    {
      title: t("prefecture"),
      value: "",
    },
    {
      title: t("city"),
      value: "",
    },
    {
      title: t("address1"),
      value: "",
    },
    {
      title: t("address2"),
      value: "",
    },
    {
      title: t("category"),
      value: "",
    },
    {
      title: t("product name"),
      value: "",
    },
    {
      title: t("order code"),
      value: "",
    },
    {
      title: t("inquiry"),
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
          {ct("back")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="../complete"
        >
          {ct("send")}
        </Button>
      </Box>
    </Box>
  );
}

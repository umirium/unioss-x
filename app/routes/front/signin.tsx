import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Divider,
  Link as MUILink,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as RemixLink } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { blue } from "@mui/material/colors";
import { useState } from "react";

interface Form {
  email: string;
  password: string;
  showPassword: boolean;
}

export default function Signin() {
  const [values, setValues] = useState<Form>({
    email: "",
    password: "",
    showPassword: false,
  });
  const { t } = useTranslation();

  const handleChange =
    (prop: keyof Form) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("common:signin")}
          </Typography>

          <Box
            component="form"
            // onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              label={t("front:email")}
              name="email"
              value={values.email}
              onChange={handleChange("email")}
              autoComplete="email"
              autoFocus
              fullWidth
              required
            />

            <FormControl sx={{ mt: 2 }} variant="outlined" fullWidth>
              <InputLabel htmlFor="password">{t("front:password")}</InputLabel>
              <OutlinedInput
                id="password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                label={t("front:password")}
                onChange={handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              fullWidth
            >
              {t("common:signin")}
            </Button>

            <Divider>
              <Typography variant="subtitle2" sx={{ ml: 1, mr: 1 }}>
                or
              </Typography>
            </Divider>

            <Button
              component={RemixLink}
              to={"/front/signup"}
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
              fullWidth
            >
              {t("common:create_new_account")}
            </Button>

            <Box sx={{ textAlign: "right" }}>
              <MUILink
                to="#"
                component={RemixLink}
                color={blue[500]}
                underline="hover"
                variant="subtitle2"
              >
                {t("common:forget_password")}
              </MUILink>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}

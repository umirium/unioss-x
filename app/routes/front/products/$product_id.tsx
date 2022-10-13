import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  InputLabel,
  Link as MUILink,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import type { LoaderArgs } from "@remix-run/node";
import { Link as RemixLink, useLoaderData } from "@remix-run/react";
import camelcaseKeys from "camelcase-keys";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const loader = async ({ params, request }: LoaderArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");

  const { data: product } = await db
    .from<definitions["products"]>("products")
    .select("*")
    .eq("product_id", params.product_id)
    .single();

  return { product: product ? camelcaseKeys(product) : product, page };
};

export default function Product() {
  const { product, page } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState("1");

  const handleChange = (event: SelectChangeEvent) => {
    setQuantity(event.target.value);
  };

  return (
    <>
      <Breadcrumbs sx={{ mb: 5 }}>
        <MUILink
          underline="hover"
          color="inherit"
          component={RemixLink}
          to={`/front/products${page ? `?page=${page}` : ""}`}
        >
          products
        </MUILink>
        <Typography color="text.primary">{product?.productName}</Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        <Grid xs={12} sm={12} md={6}>
          <img
            src={product?.imageUrl}
            alt={product?.productName}
            width="100%"
          />
        </Grid>
        <Grid xs={12} sm={12} md={6}>
          <Grid container spacing={3}>
            <Grid
              xs={12}
              sm={8}
              md={12}
              // sx={{ textAlign: { xs: "right", md: "left" } }}
            >
              <Typography variant="h4">{product?.productName}</Typography>
              <Box sx={{ mt: 3 }}>{product?.description}</Box>
              <Box sx={{ mt: 3 }}>
                金額：
                <Typography variant="h5" component="span">
                  {product?.price.toLocaleString()}
                </Typography>
                円
              </Box>
            </Grid>

            <Grid
              xs={12}
              sm={4}
              md={12}
              sx={{
                mt: { xs: 3, sm: 0, md: 3 },
                textAlign: { xs: "center", sm: "right", md: "center" },
              }}
            >
              <Box>
                <FormControl sx={{ minWidth: 80 }} size="small">
                  <InputLabel id="quantity">{t("common:quantity")}</InputLabel>
                  <Select
                    labelId="quantity"
                    label={t("common:quantity")}
                    value={quantity}
                    onChange={handleChange}
                  >
                    {[...new Array(30)].map((_key, value) => (
                      <MenuItem key={value} value={value + 1}>
                        {value + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="warning"
                  size="large"
                  endIcon={<AddShoppingCartIcon />}
                >
                  {t("front:add_to_cart")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

import {
  Box,
  Breadcrumbs,
  Button,
  Link as MUILink,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import type { LoaderArgs } from "@remix-run/node";
import { Link as RemixLink, useLoaderData } from "@remix-run/react";
import camelcaseKeys from "camelcase-keys";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";

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
          <Typography variant="h4">{product?.productName}</Typography>
          <Box sx={{ mt: 3 }}>{product?.description}</Box>
          <Box sx={{ mt: 3 }}>
            金額：
            <Typography variant="h5" component="span">
              {product?.price.toLocaleString()}
            </Typography>
            円
          </Box>
          <Box sx={{ mt: 5, textAlign: "center" }}>
            <Button
              variant="contained"
              color="warning"
              size="large"
              endIcon={<AddShoppingCartIcon />}
            >
              カートに入れる
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

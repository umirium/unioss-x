import type { SelectChangeEvent } from "@mui/material";
import {
  Box,
  Breadcrumbs,
  FormControl,
  InputLabel,
  Link as MUILink,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link as RemixLink, useLoaderData } from "@remix-run/react";
import camelcaseKeys from "camelcase-keys";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  getSession as getCartSession,
  commitSession as commitCartSession,
} from "~/utils/sessions/cart.server";
import {
  commitSession as commitNoticeSession,
  getSession as getNoticeSession,
} from "~/utils/sessions/notice.server";
import { MySubmitButton } from "~/components/atoms/MySubmitButton";
import { authenticator } from "~/utils/auth.server";
import snakecaseKeys from "snakecase-keys";

export const loader = async ({ params, request }: LoaderArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");

  const { data: product } = await db
    .from<definitions["products"]>("products")
    .select("*")
    .eq("id", params.product_id)
    .single();

  return { product: product ? camelcaseKeys(product) : product, page };
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  // show snackbar of 'added to cart' or error
  const noticeSession = await getNoticeSession(request.headers.get("cookie"));

  const authUser = await authenticator.isAuthenticated(request);

  const insert = {
    productId: Number.parseInt(formData.get("id") as string),
    quantity: Number.parseInt(formData.get("quantity") as string),
  };

  if (authUser) {
    // insert cart data to database
    try {
      const { error } = await db.from<definitions["carts"]>("carts").insert([
        snakecaseKeys({
          userId: authUser.id,
          deleteFlg: false,
          ...insert,
        }),
      ]);

      if (error) {
        throw error;
      }
    } catch (e) {
      noticeSession.flash("notice", `dbError_${Date.now()}`);

      return redirect("/front/cart", {
        headers: {
          "Set-Cookie": await commitNoticeSession(noticeSession),
        },
      });
    }
  }

  // save cart data to cookie
  const cartSession = await getCartSession(request.headers.get("Cookie"));
  const cart = cartSession.get("cart") || [];

  cart.push(insert);

  cartSession.set("cart", cart);
  noticeSession.flash("notice", `addedToCart_${Date.now()}`);

  const headers = new Headers();
  headers.append("Set-Cookie", await commitCartSession(cartSession));
  headers.append("Set-Cookie", await commitNoticeSession(noticeSession));

  return redirect("/front/cart", { headers });
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
            <Grid xs={12} sm={8} md={12}>
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
              <Form method="post">
                <Box>
                  <FormControl sx={{ minWidth: 80 }} size="small">
                    <input type="hidden" name="id" value={product?.id} />
                    <InputLabel id="quantity">
                      {t("common:quantity")}
                    </InputLabel>
                    <Select
                      name="quantity"
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
                  <MySubmitButton
                    label="add_to_cart"
                    type="submit"
                    color="warning"
                    endIcon={<AddShoppingCartIcon />}
                  />
                </Box>
              </Form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

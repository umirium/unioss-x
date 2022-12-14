import type { MouseEvent, ReactNode } from "react";
import { useEffect } from "react";
import type { SelectChangeEvent } from "@mui/material";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import camelcaseKeys from "camelcase-keys";
import { useTranslation } from "react-i18next";
import type { SnakeToCamel } from "snake-camel-types";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";
import {
  commitSession as commitAlertSession,
  getSession as getAlertSession,
} from "~/utils/sessions/alert.server";
import {
  commitSession as commitCartSession,
  getSession as getCartSession,
} from "~/utils/sessions/cart.server";
import {
  commitSession as commitNoticeSession,
  getSession as getNoticeSession,
} from "~/utils/sessions/notice.server";
import { authenticator } from "~/utils/auth.server";
import snakecaseKeys from "snakecase-keys";
import type { NoticeType } from "~/types/outline";
import { MyLinkButton } from "~/components/atoms/MyLinkButton";
import { useShowAlertContext } from "~/providers/alertProvider";
import query from "~/utils/query.server";

export const meta: MetaFunction<typeof loader> = ({ parentsData }) => {
  return {
    title: `${parentsData["routes/front"].siteTitle} | cart`,
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const cartSession = await getCartSession(request.headers.get("Cookie"));
  const cart: Array<SnakeToCamel<definitions["carts"]>> =
    cartSession.get("cart");

  if (!cart) {
    return { cart: undefined, alert: undefined };
  }

  // get product info
  const { err, data } = await query(() =>
    db
      .from<definitions["products"] & { quantity: number }>("products")
      .select("*", { count: "exact" })
      .in(
        "id",
        cart.map(({ productId }) => productId)
      )
      .eq("delete_flg", false)
      .order("id")
  );

  return {
    cart: data?.map((e) => {
      const product = e;

      const cartItem = camelcaseKeys(cart).find((e) => {
        const item = e;

        if (item.productId === product.id) {
          return true;
        }

        return false;
      });

      product.quantity = cartItem ? cartItem.quantity : 0;

      return product;
    }),
    alert: err as NoticeType | undefined,
  };
};

export const action = async ({ request }: ActionArgs) => {
  const authUser = await authenticator.isAuthenticated(request);
  const form = await request.formData();

  const proc = (form.get("proc") as string) || undefined;
  const productId = (form.get("productId") as string) || undefined;
  const quantity = Number.parseInt((form.get("quantity") as string) || "0");

  if (!proc || !productId || !["update", "delete"].includes(proc)) {
    const alertSession = await getAlertSession(request.headers.get("cookie"));

    alertSession.flash("alert", {
      key: `params_${Date.now()}`,
    });

    const headers = new Headers();
    headers.append("Set-Cookie", await commitAlertSession(alertSession));

    return redirect(request.url, { headers });
  }

  // update DB
  if (authUser) {
    const { err } = await query(
      () =>
        db
          .from<definitions["carts"]>("carts")
          .update(
            snakecaseKeys(
              proc === "update" ? { quantity } : { deleteFlg: true }
            )
          )
          .eq("user_id", authUser.id)
          .eq("product_id", productId)
          .eq("delete_flg", false),
      request
    );

    if (err) {
      return err;
    }
  }

  // update cart
  const cartSession = await getCartSession(request.headers.get("Cookie"));
  const cart: Array<
    Pick<SnakeToCamel<definitions["carts"]>, "productId" | "quantity">
  > = cartSession.get("cart") || [];

  if (form.get("proc") === "update") {
    // update quantity of item
    const index = cart?.findIndex((e) => e.productId.toString() === productId);

    if (index !== -1) {
      cart[index].quantity = quantity;
    }

    cartSession.set("cart", cart);
  } else {
    // delete item
    cartSession.set(
      "cart",
      cart.filter((e) => e.productId.toString() !== productId)
    );
  }

  // show snackbar of successful sign-in
  const noticeSession = await getNoticeSession(request.headers.get("cookie"));
  noticeSession.flash("notice", { key: `cartUpdate_${Date.now()}` });

  const headers = new Headers();
  headers.append("Set-Cookie", await commitCartSession(cartSession));
  headers.append("Set-Cookie", await commitNoticeSession(noticeSession));

  return redirect(request.url, { headers });
};

export default function Cart() {
  const { cart, alert } = useLoaderData<typeof loader>();
  const { showAlert } = useShowAlertContext();
  const submit = useSubmit();
  const { t } = useTranslation();
  const transition = useTransition();

  useEffect(() => {
    showAlert(alert);
  }, [alert, showAlert]);

  const handleChangeQuantity = (event: SelectChangeEvent, child: ReactNode) => {
    // NOTE: 'currentTarget' does not work with SelectChangeEvent, so can not get dataset.
    const formData = new FormData();
    formData.set("proc", "update");
    formData.set("productId", event.target.name);
    formData.set("quantity", event.target.value);

    submit(formData, { method: "post" });
  };

  const handleClickDelete = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    const formData = new FormData();
    formData.set("proc", "delete");
    formData.set("productId", event.currentTarget.value);

    submit(formData, { method: "post" });
  };

  return (
    <>
      <Box>
        <h1>{t("front:cart")}</h1>
      </Box>

      <Box>
        {cart && cart.length !== 0 ? (
          <>
            {t("common:total")}:{" "}
            <Typography variant="h5" component="span">
              {t("common:jpy", {
                price: cart
                  ?.reduce((sum, e) => sum + e.quantity * e.price, 0)
                  .toLocaleString(),
              })}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h6" component="span">
              {t("front:yourCartIsEmpty")}
            </Typography>
            <Box sx={{ mt: 5, textAlign: "center" }}>
              <MyLinkButton variant="contained" to={"/front/products"}>
                {t("front:goToProducts")}
              </MyLinkButton>
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ mt: 5 }}>
        <Form method="post">
          {cart?.map((item, index) => (
            <Box key={index} sx={{ display: "flex" }}>
              <Box>
                <Link to={`/front/products/${item.id}`}>
                  <img src={item.imageUrl} alt={item.name} width={200} />
                </Link>
              </Box>

              <Box sx={{ ml: 2 }}>
                {t("front:productName")}: {item.name}
                <br />
                {t("common:price")}:{" "}
                {t("common:jpy", {
                  price: item.price.toLocaleString(),
                })}
                <br />
                {t("common:quantity")}: {item.quantity}
                <br />
                <br />
                {t("common:subtotal")}:{" "}
                <Typography variant="h6" component="span">
                  {t("common:jpy", {
                    price: (item.quantity * item.price).toLocaleString(),
                  })}
                </Typography>
                <br />
                <br />
                <FormControl>
                  <InputLabel>{t("common:quantity")}</InputLabel>
                  <Select
                    label={t("common:quantity")}
                    name={item.id.toString()}
                    value={item.quantity.toString()}
                    size="small"
                    disabled={transition.state !== "idle"}
                    onChange={handleChangeQuantity}
                  >
                    {[
                      ...new Array(item.quantity > 30 ? item.quantity : 30),
                    ].map((_, value) => (
                      <MenuItem key={value + 1} value={value + 1}>
                        {value + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  color="error"
                  value={item.id}
                  sx={{ ml: 2 }}
                  disabled={transition.state !== "idle"}
                  onClick={handleClickDelete}
                >
                  {t("common:delete")}
                </Button>
              </Box>
            </Box>
          ))}
        </Form>
      </Box>
    </>
  );
}

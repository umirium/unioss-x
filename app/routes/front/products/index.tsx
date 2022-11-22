import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Pagination,
  PaginationItem,
  Skeleton,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import camelcaseKeys from "camelcase-keys";
import { useEffect } from "react";
import { useShowAlertContext } from "~/providers/alertProvider";
import type { NoticeType } from "~/types/outline";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";

const PER_PAGE = 4;

export const meta: MetaFunction<typeof loader> = ({ parentsData }) => {
  return {
    title: `${parentsData["routes/front"].siteTitle} | products`,
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;

  const end = Number(page) * PER_PAGE - 1;
  const start = end - (PER_PAGE - 1);

  let alert: NoticeType | undefined = undefined;

  let products;
  let dataLength;

  try {
    const { data, count, error } = await db
      .from<definitions["products"]>("products")
      .select("*", { count: "exact" })
      .order("id")
      .range(start, end);

    if (error) {
      console.log(error);
      throw new Error("read");
    }

    products = data;
    dataLength = count;
  } catch (error: Error | unknown) {
    // show alert of database errors
    if (error instanceof Error) {
      alert = {
        key: `dbErrors_${Date.now()}`,
        options: { error: `common:${error.message}` },
      };
    } else {
      alert = {
        key: `unknown_${Date.now()}`,
      };
    }
  }

  const count = dataLength ? Math.ceil(dataLength / PER_PAGE) : 0;

  return {
    products: products ? camelcaseKeys(products) : products,
    count,
    page,
    alert,
  };
};

export default function Index() {
  const { products, count, page, alert } = useLoaderData<typeof loader>();
  const { showAlert } = useShowAlertContext();

  useEffect(() => {
    showAlert(alert);
  }, [alert, showAlert]);

  return (
    <Box sx={{ mt: 8 }}>
      <Box sx={{ maxWidth: 800, m: "auto" }}>
        <Grid container spacing={3} alignItems="center">
          {/* TODO: If 'defer' is implemented in Remix, use this code. */}
          {!products
            ? [...new Array(12)].map((item, index) => (
                <Grid key={index} xs={12} sm={6} md={4}>
                  <Card sx={{ width: "100%", height: 300 }}>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      width="100%"
                      height={140}
                    />
                    <CardContent>
                      <Typography component="div" variant="h4" width="60%">
                        <Skeleton animation="wave" />
                      </Typography>

                      <Typography component="div" variant="body2">
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                      </Typography>

                      <Typography component="div" variant="body2">
                        <Skeleton animation="wave" width="40%" />
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : products.map((item, index) => (
                <Grid key={index} xs={12} sm={6} md={4}>
                  <Card sx={{ width: "100%", height: 300 }}>
                    <CardActionArea
                      component={Link}
                      to={`/front/products/${item.id}${
                        page === 1 ? "" : `?page=${page}`
                      }`}
                      sx={{ height: "100%" }}
                    >
                      <CardMedia
                        component="img"
                        height={140}
                        image={item.imageUrl}
                        alt={item.productName}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {item.productName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Pagination
          count={count}
          page={page}
          color="primary"
          sx={{ display: "inline-block" }}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={`/front/products${
                item.page === 1 ? "" : `?page=${item.page}`
              }`}
              {...item}
            />
          )}
        />
      </Box>
    </Box>
  );
}

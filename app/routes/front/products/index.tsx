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
import type { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import camelcaseKeys from "camelcase-keys";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";
// import { Suspense } from "react";
// TODO: error
// import { defer } from "@remix-run/node";

const PER_PAGE = 4;

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;

  const end = Number(page) * PER_PAGE - 1;
  const start = end - (PER_PAGE - 1);

  const { data: products, count: dataLength } = await db
    .from<definitions["products"]>("products")
    .select("*", { count: "exact" })
    .order("product_id")
    .range(start, end);

  const count = dataLength ? Math.ceil(dataLength / PER_PAGE) : 0;

  return {
    products: products ? camelcaseKeys(products) : products,
    count,
    page,
  };
};

export default function Index() {
  const { products, count, page } = useLoaderData<typeof loader>();

  return (
    <Box sx={{ mt: 8 }}>
      <Box sx={{ maxWidth: 800, m: "auto" }}>
        <Grid container spacing={3} alignItems="center">
          {/* TODO: If 'defer' is implemented in Remix, use this code. */}
          {/* cf. https://github.com/remix-run/remix/blob/deferred/docs/guides/streaming.md */}
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
                      to={`/front/products/${item.productId}${
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

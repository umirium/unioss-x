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
import { Link as RemixLink, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { useShowAlertContext } from "~/providers/alertProvider";
import type { NoticeType } from "~/types/outline";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";
import { getBreadcrumbs } from "~/components/products/Breadcrumbs";
import query from "~/utils/query.server";
import { getParams } from "~/utils/products";

const PER_PAGE = 4;

export const meta: MetaFunction<typeof loader> = ({ parentsData }) => {
  return {
    title: `${parentsData["routes/front"].siteTitle} | products`,
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const page = Number(url.searchParams.get("page")) || 1;

  const end = page * PER_PAGE - 1;
  const start = end - (PER_PAGE - 1);

  const { err, data, count } = await query(() =>
    db
      .from<definitions["products"]>("products")
      .select("*", { count: "exact" })
      .like("product_name", q ? `%${q}%` : "%")
      .order("id")
      .range(start, end)
  );

  const countPerPage = count ? Math.ceil(count / PER_PAGE) : 0;

  return {
    products: data,
    count,
    countPerPage,
    page,
    q,
    alert: err as NoticeType | undefined,
  };
};

export default function Index() {
  const { products, count, countPerPage, page, q, alert } =
    useLoaderData<typeof loader>();
  const { showAlert } = useShowAlertContext();

  useEffect(() => {
    showAlert(alert);
  }, [alert, showAlert]);

  return (
    <>
      {getBreadcrumbs({ q, page, count })}

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
                        component={RemixLink}
                        to={`/front/products/${item.id}${getParams(page, q)}`}
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
          {countPerPage !== 0 ? (
            <Pagination
              count={countPerPage}
              page={page}
              color="primary"
              sx={{ display: "inline-block" }}
              renderItem={(item) => (
                <PaginationItem
                  component={RemixLink}
                  to={`/front/products${getParams(item.page, q)}`}
                  {...item}
                />
              )}
            />
          ) : (
            "Item not found"
          )}
        </Box>
      </Box>
    </>
  );
}

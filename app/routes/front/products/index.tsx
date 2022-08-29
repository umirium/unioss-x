import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import type { LoaderArgs } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";

type LoaderType = Awaited<ReturnType<typeof loader>>;

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");

  if (!page) {
    return [];
  }

  const products = await db
    .from<definitions["products"]>("products")
    .select("*")
    .order("product_id");

  return products?.data;
};

export default function Index() {
  const fetcher = useFetcher<LoaderType>();

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load("/front/products?index&page=1");
    }
  }, [fetcher.state, fetcher.data, fetcher]);

  return (
    <Box sx={{ mt: 8 }}>
      <Box sx={{ maxWidth: 800, m: "auto" }}>
        <Grid container spacing={3} alignItems="center">
          {fetcher?.data?.map((item, index) => (
            <Grid key={index} xs={12} sm={6} md={4}>
              <Card sx={{ width: "100%", height: 300 }}>
                <CardActionArea
                  component={Link}
                  to={`/front/products/${item.product_id}`}
                  sx={{ height: "100%" }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image_url}
                    alt={item.product_name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.product_name}
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
    </Box>
  );
}
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { definitions } from "~/types/tables";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
  const products = await db
    .from<definitions["products"]>("products")
    .select("*")
    .order("product_id");

  return products ? products.data : [];
};

export default function Index() {
  const products = useLoaderData<Array<definitions["products"]>>();

  return (
    <Box sx={{ maxWidth: 800, m: "auto" }}>
      <Grid container spacing={3} alignItems="center">
        {products.map((item, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card sx={{ maxWidth: 345, height: 300 }}>
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
  );
}

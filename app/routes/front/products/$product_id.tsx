import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ params }) => {
  return json({ product_id: params.product_id });
};

export default function Product() {
  // const { handleChangeBreadcrumbs } = useBreadcrumbs();
  const { product_id } = useLoaderData();

  // set Breadcrumbs
  // useEffect(() => {
  //   handleChangeBreadcrumbs(product_id);
  // });

  return <>product_id: {product_id}</>;
}

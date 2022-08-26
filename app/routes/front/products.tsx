import { Breadcrumbs, Link as MUILink } from "@mui/material";
import { Link as RemixLink, Outlet } from "@remix-run/react";
import { useState } from "react";

// TODO: Can't get function (undefined) in child component... Why??
// type ContextType = {
//   handleChangeBreadcrumbs: (
//     product_id: number | null,
//     product_name?: string
//   ) => void;
// };

// const defaultLinks = <Typography color="text.primary">products</Typography>;
const defaultLinks = (
  <MUILink
    underline="hover"
    color="inherit"
    component={RemixLink}
    to="/front/products"
  >
    products
  </MUILink>
);

export default function Products() {
  const [breadcrumbLinks, setBreadcrumbLinks] = useState(defaultLinks);

  // const handleChangeBreadcrumbs = (
  //   product_id: number | null,
  //   product_name?: string
  // ) => {
  //   if (!product_id) {
  //     setBreadcrumbLinks(defaultLinks);
  //     return;
  //   }
  //   setBreadcrumbLinks(
  //     <>
  //       <MUILink
  //         underline="hover"
  //         color="inherit"
  //         component={RemixLink}
  //         to="/front/products"
  //       >
  //         products
  //       </MUILink>
  //       <Typography color="text.primary">{product_id}'s item</Typography>
  //     </>
  //   );
  // };

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 5 }}>
        {breadcrumbLinks}
      </Breadcrumbs>

      {/* <Outlet context={handleChangeBreadcrumbs} /> */}
      <Outlet />
    </>
  );
}

// export function useBreadcrumbs() {
//   return useOutletContext<ContextType>();
// }

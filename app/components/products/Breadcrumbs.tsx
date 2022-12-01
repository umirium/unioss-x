import { Breadcrumbs, Link as MUILink, Typography } from "@mui/material";
import { Link as RemixLink } from "@remix-run/react";
import { getParams } from "~/utils/products";

interface Props {
  page: number | null;
  count?: number | null;
  q?: string;
  productName?: string;
}

export const getBreadcrumbs = (props: Props) => {
  let elm = undefined;

  if (!props.productName) {
    // products page

    if (!props.q) {
      return elm;
    }

    // do product search
    return (
      <Breadcrumbs>
        <MUILink
          underline="hover"
          color="inherit"
          component={RemixLink}
          to={`/front/products${props.page ? `?page=${props.page}` : ""}`}
        >
          products
        </MUILink>
        <Typography color="text.primary">
          {props.count} search results for "{props.q}"
        </Typography>
      </Breadcrumbs>
    );
  } else {
    // product page
    return (
      <Breadcrumbs>
        <MUILink
          underline="hover"
          color="inherit"
          component={RemixLink}
          to={`/front/products${props.page ? `?page=${props.page}` : ""}`}
        >
          products
        </MUILink>
        {props.q && (
          <MUILink
            underline="hover"
            color="inherit"
            component={RemixLink}
            to={`/front/products${getParams(props.page, props.q)}`}
          >
            search results for "{props.q}"
          </MUILink>
        )}
        <Typography color="text.primary">{props.productName}</Typography>
      </Breadcrumbs>
    );
  }
};

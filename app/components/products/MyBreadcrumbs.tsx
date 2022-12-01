import { Breadcrumbs, Link as MUILink, Typography } from "@mui/material";
import { Link as RemixLink } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { getParams } from "~/utils/products";

interface Props {
  page: number | null;
  count?: number | null;
  q?: string;
  productName?: string;
}

export default function MyBreadcrumbs(props: Props) {
  const { t } = useTranslation();
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
          {t("front:products")}
        </MUILink>
        <Typography color="text.primary">
          {t("front:searchResultOnProducts", {
            count: props.count || undefined,
            keyword: props.q,
          })}
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
          {t("front:products")}
        </MUILink>
        {props.q && (
          <MUILink
            underline="hover"
            color="inherit"
            component={RemixLink}
            to={`/front/products${getParams(props.page, props.q)}`}
          >
            {t("front:searchResultOnProduct", {
              keyword: props.q,
            })}
          </MUILink>
        )}
        <Typography color="text.primary">{props.productName}</Typography>
      </Breadcrumbs>
    );
  }
}

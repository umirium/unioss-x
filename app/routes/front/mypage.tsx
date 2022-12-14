import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { Box } from "@mui/material";

export const meta: MetaFunction<typeof loader> = ({ parentsData }) => {
  return {
    title: `${parentsData["routes/front"].siteTitle} | My page`,
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const authUser = await authenticator.isAuthenticated(request);

  if (!authUser) {
    return redirect("/front/signin?r=/front/mypage");
  }

  return json({ authUser });
};

export default function Mypage() {
  const { authUser } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <>
      <h1>{t("front:mypage")}</h1>
      <Box>
        email: {authUser.email}
        <br />
        name: {authUser.lastName} {authUser.firstName}
      </Box>
    </>
  );
}

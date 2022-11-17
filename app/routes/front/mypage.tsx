import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import {
  commitSession as commitAlertSession,
  getSession as getAlertSession,
} from "~/utils/sessions/alert.server";
import type { NoticeType } from "~/types/outline";
import MyAlert from "~/components/atoms/MyAlert";
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

  const alertSession = await getAlertSession(request.headers.get("Cookie"));
  const alert: NoticeType = alertSession.get("alert");

  const headers = new Headers();
  headers.append("Set-Cookie", await commitAlertSession(alertSession));

  return json({ authUser, alert }, { headers });
};

export default function Mypage() {
  const { authUser, alert } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <>
      {/* show errors with alert */}
      <MyAlert i18nObj={alert} />

      <h1>{t("front:mypage")}</h1>
      <Box>
        email: {authUser.email}
        <br />
        name: {authUser.lastName} {authUser.firstName}
      </Box>
    </>
  );
}

import type { AlertProps } from "@mui/material";
import { Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { NoticeType } from "~/types/outline";
import transI18n from "~/utils/transI18n";

export default function MyAlert(
  props: AlertProps & { i18nObj: NoticeType | undefined }
) {
  const { t } = useTranslation();
  const transAlert = transI18n("alert", props.i18nObj, t);

  return (
    <>
      {props.i18nObj && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {transAlert}
        </Alert>
      )}
    </>
  );
}

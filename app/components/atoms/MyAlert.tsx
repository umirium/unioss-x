import type { AlertProps } from "@mui/material";
import { Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import type { NoticeType } from "~/types/outline";
import transI18n from "~/utils/transI18n";
import { useEffect, useState } from "react";

export default function MyAlert(
  props: AlertProps & { i18nObj: NoticeType | undefined }
) {
  const [i18nObj, setI18nObj] = useState(props.i18nObj);
  const { t } = useTranslation();
  const transAlert = transI18n("alert", i18nObj, t);

  useEffect(() => {
    setI18nObj(props.i18nObj);
  }, [props.i18nObj]);

  return (
    <Collapse in={!!i18nObj}>
      <Alert
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setI18nObj(undefined);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mt: 2, mb: 2 }}
      >
        {transAlert}
      </Alert>
    </Collapse>
  );
}

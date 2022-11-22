import type { ComponentType, SyntheticEvent } from "react";
import { useState, useEffect } from "react";
import type {
  SlideProps,
  SnackbarCloseReason,
  SnackbarProps,
} from "@mui/material";
import { Slide, Typography } from "@mui/material";
import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { NoticeType } from "~/types/outline";
import { useTranslation } from "react-i18next";
import transI18n from "~/utils/transI18n";

type TransitionProps = Omit<SlideProps, "direction">;

const TransitionUp = (props: TransitionProps) => (
  <Slide {...props} direction="up" />
);

export default function MyNotice(
  props: SnackbarProps & { i18nObj: NoticeType }
) {
  const [cmpTransition, setCmpTransition] = useState<
    ComponentType<TransitionProps> | undefined
  >(undefined);
  const { t } = useTranslation();
  const transNotice = transI18n("notice", props.i18nObj, t);

  useEffect(() => {
    setCmpTransition(() => TransitionUp);
  }, []);

  const handleCloseSnackbar = (
    event: SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (props.onClose) {
      props?.onClose(event, reason || "clickaway");
    }
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={props.open}
      TransitionComponent={cmpTransition}
      onClose={handleCloseSnackbar}
      message={
        <Typography color={props.i18nObj?.isAlert ? "error" : "common"}>
          {transNotice}
        </Typography>
      }
      autoHideDuration={5000}
      action={
        <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}

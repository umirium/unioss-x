import type { ComponentType, SyntheticEvent } from "react";
import { useState, useEffect } from "react";
import type {
  SlideProps,
  SnackbarCloseReason,
  SnackbarProps,
} from "@mui/material";
import { useTheme, Slide, Typography } from "@mui/material";
import { Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { NoticeType } from "~/types/outline";
import { useTranslation } from "react-i18next";
import transI18n from "~/utils/transI18n";
import { red } from "@mui/material/colors";

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
  const darkTheme = useTheme();
  const transNotice = transI18n("notice", props.i18nObj, t);

  useEffect(() => {
    setCmpTransition(() => TransitionUp);
  }, []);

  const handleClose = (
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
      onClose={handleClose}
      message={
        <Typography
          color={
            props.i18nObj?.isAlert
              ? darkTheme.palette.mode === "light"
                ? red[200]
                : "error"
              : "common"
          }
        >
          {transNotice}
        </Typography>
      }
      autoHideDuration={5000}
      action={
        <IconButton size="small" color="inherit" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}

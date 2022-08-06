import { IconButton } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";

export default function ToggleLanguageButton() {
  const { i18n } = useTranslation("front");

  const handleClick = () => {
    if (i18n.language === "en") {
      i18n.changeLanguage("ja");
    } else if (i18n.language === "ja") {
      i18n.changeLanguage("en");
    }
  };

  return (
    <IconButton sx={{ ml: 1 }} onClick={handleClick}>
      <LanguageIcon />
    </IconButton>
  );
}

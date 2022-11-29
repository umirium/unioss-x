import { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Chip,
  createTheme,
  IconButton,
  InputAdornment,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiOutlinedInput: {
      defaultProps: {
        sx: { width: 40, cursor: "default" },
      },
      styleOverrides: {
        notchedOutline: {
          border: "none",
        },
      },
    },
  },
});

const shrinkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiOutlinedInput: {
      defaultProps: {
        sx: {
          "@keyframes shrink": {
            from: {
              maxWidth: 200,
            },
            to: {
              maxWidth: 40,
            },
          },
          animation: "shrink 0.6s ease",
          transitionDuration: "1s",
          transitionProperty: "max-width",
          maxWidth: 40,
        },
      },
      styleOverrides: {
        notchedOutline: {
          border: "none",
        },
      },
    },
  },
});

const expandTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiOutlinedInput: {
      defaultProps: {
        sx: {
          "@keyframes expand": {
            from: {
              maxWidth: 40,
            },
            to: {
              maxWidth: 200,
            },
          },
          animation: "expand 0.4s ease",
          transitionDuration: "0s",
          transitionProperty: "max-width",
          maxWidth: 200,
        },
      },
    },
  },
});

function SearchBox() {
  const [outlinedTheme, setOutlinedTheme] = useState(defaultTheme);
  const [inputting, setInputting] = useState(false);
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);
  const searchIconRef = useRef<HTMLButtonElement>(null);
  const closeIconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);
  });

  const onExpand = () => {
    // hide search icon
    searchIconRef.current && (searchIconRef.current.style.display = "none");
    // show close icon
    closeIconRef.current &&
      (closeIconRef.current.style.display = "inline-flex");

    setOutlinedTheme(expandTheme);
    ref.current?.focus();
  };

  const onShrink = () => {
    setOutlinedTheme(shrinkTheme);

    // clear value of search box
    ref.current && (ref.current.value = "");

    // show search icon
    searchIconRef.current &&
      (searchIconRef.current.style.display = "inline-flex");
    // hide close icon
    closeIconRef.current && (closeIconRef.current.style.display = "none");
  };

  const keyDownHandler = (e: KeyboardEvent) => {
    if ((e.ctrlKey && e.key === "k") || (e.metaKey && e.key === "k")) {
      onExpand();
    }
  };

  const handleKeydown = (key: string) => {
    if (inputting) {
      return;
    }

    if (key === "Enter" && ref.current?.value) {
      console.log(`[${ref.current?.value}] searching...`);
      onShrink();
    } else if (key === "Escape") {
      onShrink();
    }
  };

  return (
    <>
      <Box sx={{ maxWidth: 200 }}>
        <ThemeProvider theme={outlinedTheme}>
          <TextField
            inputRef={ref}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    ref={searchIconRef}
                    title="press Ctrl + K (or Cmd + K)"
                    color="inherit"
                    edge="start"
                    onClick={() => {
                      onExpand();
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Chip
                    ref={closeIconRef}
                    label="×"
                    title="press esc"
                    size="small"
                    sx={{ cursor: "pointer", display: "none" }}
                    clickable={true}
                    onClick={() => {
                      onShrink();
                    }}
                  />
                </InputAdornment>
              ),
            }}
            size="small"
            variant="outlined"
            placeholder={t("common:search")}
            onBlur={() => {
              if (!ref.current?.value) {
                onShrink();
              }
            }}
            onCompositionStart={() => {
              setInputting(true);
            }}
            onCompositionEnd={() => {
              setInputting(false);
            }}
            onKeyDown={(e) => handleKeydown(e.key)}
          />
        </ThemeProvider>
      </Box>
    </>
  );
}

export default SearchBox;

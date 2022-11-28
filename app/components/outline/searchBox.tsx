import { useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  createTheme,
  IconButton,
  InputAdornment,
  TextField,
  ThemeProvider,
} from "@mui/material";

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
  const ref = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setOutlinedTheme(expandTheme);
    ref.current?.focus();
  };

  const handleBlur = () => {
    if (!ref.current?.value) {
      setOutlinedTheme(shrinkTheme);
    }
  };

  const handleKeydown = (key: string) => {
    if (inputting) {
      return;
    }

    if (key === "Enter" && ref.current?.value) {
      setOutlinedTheme(shrinkTheme);
      ref.current?.value && (ref.current.value = "");

      console.log("searching...");
    } else if (key === "Escape") {
      setOutlinedTheme(shrinkTheme);
      ref.current?.value && (ref.current.value = "");
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
                    color="inherit"
                    edge="start"
                    onClick={handleClick}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            size="small"
            variant="outlined"
            placeholder="search"
            onBlur={handleBlur}
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

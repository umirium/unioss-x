import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Button,
  createTheme,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import type { ReactElement } from "react";
import { createContext, useMemo, useLayoutEffect, useState } from "react";
import Outline from "~/components/outline";

interface Props {
  children: ReactElement;
}

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function Mui(props: Props) {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  useLayoutEffect(() => {
    setThemeMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
        },
      }),
    [themeMode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <Outline>
          <Box>
            <Box>
              <Button variant="text">Text</Button>
              <Button variant="contained">Contained</Button>
              <Button variant="outlined">Outlined</Button>
            </Box>

            <Typography sx={{ paddingTop: "1em" }}>
              {[...new Array(10)]
                .map(
                  () => `
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
                    dolor purus non enim praesent elementum facilisis leo vel. Risus at
                    ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
                    quisque non tellus. Convallis convallis tellus id interdum velit
                    laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
                    adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
                    integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
                    eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
                    quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
                    vivamus at augue. At augue eget arcu dictum varius duis at consectetur
                    lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
                    faucibus et molestie ac.

                    Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
                    ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
                    elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse
                    sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat
                    mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis
                    risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas
                    purus viverra accumsan in. In hendrerit gravida rutrum quisque non
                    tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
                    morbi tristique senectus et. Adipiscing elit duis tristique
                    sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                    eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
                    posuere sollicitudin aliquam ultrices sagittis orci a.
                  `
                )
                .join("\n")}
            </Typography>
          </Box>
        </Outline>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

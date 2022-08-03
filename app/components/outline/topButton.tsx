import { useScrollTrigger, Fade, Box, Fab } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import type { MouseEvent } from "react";

export default function TopButton() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
  });

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Fade>
  );
}

import { Box } from "@mui/material";
import { memo } from "react";

export const NotFoundPage = memo(() => {
  return (
    <Box>
      <h1>404 Not Found</h1>
    </Box>
  );
});
NotFoundPage.displayName = "NotFoundPage";

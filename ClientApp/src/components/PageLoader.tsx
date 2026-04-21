import { CircularProgress, Box, Typography } from "@mui/material";

function PageLoader() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "50vh",
      }}
    >
      <CircularProgress size={40} thickness={4} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Loading module...
      </Typography>
    </Box>
  );
}

export default PageLoader;

import { Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
} from "@mui/material";

export default function RootLayout() {
  return (
    <>
      <CssBaseline />
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            CloudOps Kanban
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        {/* The Outlet is where the child routes (like Board) will render */}
        <Outlet />
      </Container>
    </>
  );
}

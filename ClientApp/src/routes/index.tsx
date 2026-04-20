import RootLayout from "@/layouts/RootLayout";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Board, ErrorPage } from "./lazyComponents";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/board" replace />,
      },
      {
        path: "board",
        element: <Board />,
      },
    ],
  },
]);

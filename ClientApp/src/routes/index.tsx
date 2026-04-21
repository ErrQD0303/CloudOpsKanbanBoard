import RootLayout from "@/layouts/RootLayout";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Board } from "./lazyComponents";
import { Suspense } from "react";
import ErrorPage from "@/pages/ErrorPage";
import PageLoader from "@/components/PageLoader";

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
        element: (
          <Suspense fallback={<PageLoader />}>
            <Board />
          </Suspense>
        ),
      },
    ],
  },
]);

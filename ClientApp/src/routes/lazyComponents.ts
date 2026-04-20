import { lazy } from "react";

export const RootLayout = lazy(() => import("@/layouts/RootLayout"));
export const ErrorPage = lazy(() => import("@/pages/Error"));
export const Board = lazy(() => import("@/pages/Board/Index"));

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Pages, Routes } from "@/pages";

export function Router() {
    const browserRouter = createBrowserRouter([
        {
            path: "/create-account",
            element: <div></div>,
            errorElement: <div></div>,
        },
        {
            path: "/login",
            element: <div></div>,
            errorElement: <div></div>,
        },
        {
            path: "/",
            element: <Pages.Root />,
            children: Routes.Root,
            errorElement: <div></div>,
        },
    ]);

    return <RouterProvider router={browserRouter} />;
}

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Pages } from "@/pages";

export function Router() {
    const browserRouter = createBrowserRouter([
        {
            path: "/",
            element: <Pages.Home />,
            errorElement: <div></div>,
        },
    ]);

    return <RouterProvider router={browserRouter} />;
}

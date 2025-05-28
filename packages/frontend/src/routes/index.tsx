import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Pages, Routes } from "@/pages";

export function Router() {
    return (
        <RouterProvider
            router={createBrowserRouter(
                [
                    {
                        path: "/create-account",
                        element: <Pages.CreateAccount />,
                        errorElement: <Pages.ErrorPage />,
                    },
                    {
                        path: "/login",
                        element: <Pages.Login />,
                        errorElement: <Pages.ErrorPage />,
                    },
                    {
                        path: "/terms-and-conditions",
                        element: <Pages.TermsAndConditions />,
                        errorElement: <Pages.ErrorPage />,
                    },
                    {
                        path: "/privacy-policy",
                        element: <Pages.PrivacyPolicy />,
                        errorElement: <Pages.ErrorPage />,
                    },
                    {
                        path: "/",
                        element: <Pages.Root />,
                        children: Routes.Root,
                        errorElement: <Pages.ErrorPage />,
                    },
                ],
                {
                    future: {
                        v7_fetcherPersist: true,
                        v7_relativeSplatPath: true,
                        v7_partialHydration: true,
                        v7_normalizeFormMethod: true,
                        v7_skipActionErrorRevalidation: true,
                    },
                },
            )}
            future={{ v7_startTransition: true }}
        />
    );
}

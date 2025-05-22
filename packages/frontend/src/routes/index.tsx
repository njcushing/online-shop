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
                        errorElement: <div></div>,
                    },
                    {
                        path: "/login",
                        element: <Pages.Login />,
                        errorElement: <div></div>,
                    },
                    {
                        path: "/terms-and-conditions",
                        element: <Pages.TermsAndConditions />,
                        errorElement: <div></div>,
                    },
                    {
                        path: "/privacy-policy",
                        element: <Pages.PrivacyPolicy />,
                        errorElement: <div></div>,
                    },
                    {
                        path: "/",
                        element: <Pages.Root />,
                        children: Routes.Root,
                        errorElement: <div></div>,
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

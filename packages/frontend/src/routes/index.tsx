import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Pages, Routes } from "@/pages";
import { ScrollToTop } from "@/features/ScrollToTop";

export function Router() {
    const browserRouter = createBrowserRouter(
        [
            {
                path: "/create-account",
                element: (
                    <>
                        <ScrollToTop />
                        <Pages.CreateAccount />
                    </>
                ),
                errorElement: <Pages.ErrorPage />,
            },
            {
                path: "/login",
                element: (
                    <>
                        <ScrollToTop />
                        <Pages.Login />
                    </>
                ),
                errorElement: <Pages.ErrorPage />,
            },
            {
                path: "/terms-and-conditions",
                element: (
                    <>
                        <ScrollToTop />
                        <Pages.TermsAndConditions />
                    </>
                ),
                errorElement: <Pages.ErrorPage />,
            },
            {
                path: "/privacy-policy",
                element: (
                    <>
                        <ScrollToTop />
                        <Pages.PrivacyPolicy />
                    </>
                ),
                errorElement: <Pages.ErrorPage />,
            },
            {
                path: "/",
                element: (
                    <>
                        <ScrollToTop />
                        <Pages.Root />
                    </>
                ),
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
    );

    return <RouterProvider router={browserRouter} future={{ v7_startTransition: true }} />;
}

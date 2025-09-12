import { ErrorPage } from "@/pages/ErrorPage";
import { PersonalInformation } from "./components/PersonalInformation";
import { Addresses } from "./components/Addresses";
import { Security } from "./components/Security";
import { OrderHistory } from "./components/OrderHistory";
import { Subscriptions } from "./components/Subscriptions";

export const Routes = [
    {
        path: "personal-information",
        element: <PersonalInformation />,
        errorElement: <ErrorPage />,
    },
    {
        path: "addresses",
        element: <Addresses />,
        errorElement: <ErrorPage />,
    },
    {
        path: "security",
        element: <Security />,
        errorElement: <ErrorPage />,
    },
    {
        path: "payment-information",
        element: <div></div>,
        errorElement: <ErrorPage />,
    },
    {
        path: "order-history",
        element: <OrderHistory />,
        errorElement: <ErrorPage />,
    },
    {
        path: "subscriptions",
        element: <Subscriptions />,
        errorElement: <ErrorPage />,
    },
];

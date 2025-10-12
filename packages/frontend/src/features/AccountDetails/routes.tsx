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
        errorElement: <ErrorPage hideHeader hideFooter height="fill" />,
    },
    {
        path: "addresses",
        element: <Addresses />,
        errorElement: <ErrorPage hideHeader hideFooter height="fill" />,
    },
    {
        path: "security",
        element: <Security />,
        errorElement: <ErrorPage hideHeader hideFooter height="fill" />,
    },
    {
        path: "payment-information",
        element: <div></div>,
        errorElement: <ErrorPage hideHeader hideFooter height="fill" />,
    },
    {
        path: "order-history",
        element: <OrderHistory />,
        errorElement: <ErrorPage hideHeader hideFooter height="fill" />,
    },
    {
        path: "subscriptions",
        element: <Subscriptions />,
        errorElement: <ErrorPage hideHeader hideFooter height="fill" />,
    },
];

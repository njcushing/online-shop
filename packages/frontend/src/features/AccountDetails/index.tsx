import { useLocation, Outlet, Link } from "react-router-dom";
import { NavLink, NavLinkProps } from "@mantine/core";
import { CaretRight } from "@phosphor-icons/react";
import { ErrorPage } from "@/pages/ErrorPage";
import { PersonalInformation } from "./components/PersonalInformation";
import styles from "./index.module.css";

export const Routes = [
    {
        path: "personal-information",
        element: <PersonalInformation />,
        errorElement: <ErrorPage />,
    },
    {
        path: "addresses",
        element: <div></div>,
        errorElement: <ErrorPage />,
    },
    {
        path: "security",
        element: <div></div>,
        errorElement: <ErrorPage />,
    },
    {
        path: "payment-information",
        element: <div></div>,
        errorElement: <ErrorPage />,
    },
    {
        path: "order-history",
        element: <div></div>,
        errorElement: <ErrorPage />,
    },
    {
        path: "subscriptions",
        element: <div></div>,
        errorElement: <ErrorPage />,
    },
];

const NavLinkClassNames: NavLinkProps["classNames"] = {
    root: styles["NavLink-root"],
    label: styles["NavLink-label"],
};

const groups = [
    { to: "personal-information", label: "Personal Information" },
    { to: "addresses", label: "Addresses" },
    { to: "security", label: "Security" },
    { to: "payment-information", label: "Payment Information" },
    { to: "order-history", label: "Order History" },
    { to: "subscriptions", label: "Subscriptions" },
];

export function AccountDetails() {
    const { pathname } = useLocation();
    const currentGroup = pathname.split("/").at(-1);

    return (
        <section className={styles["account-details"]}>
            <div className={styles["account-details-width-controller"]}>
                <nav className={styles["menu"]}>
                    {groups.map((group) => {
                        const { to, label } = group;
                        return (
                            <NavLink
                                classNames={NavLinkClassNames}
                                component={Link}
                                to={to}
                                label={label}
                                rightSection={<CaretRight size={16} weight="bold" />}
                                data-selected={currentGroup === to}
                                key={label}
                            />
                        );
                    })}
                </nav>
                <div className={styles["content"]}>
                    <Outlet />
                </div>
            </div>
        </section>
    );
}

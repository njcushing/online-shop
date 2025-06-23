import { Outlet, Link } from "react-router-dom";
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

export function AccountDetails() {
    return (
        <section className={styles["account-details"]}>
            <div className={styles["account-details-width-controller"]}>
                <nav className={styles["menu"]}>
                    <NavLink
                        classNames={NavLinkClassNames}
                        component={Link}
                        to="personal-information"
                        label="Personal Information"
                        rightSection={<CaretRight size={16} weight="bold" />}
                    />
                    <NavLink
                        classNames={NavLinkClassNames}
                        component={Link}
                        to="addresses"
                        label="Addresses"
                        rightSection={<CaretRight size={16} weight="bold" />}
                    />
                    <NavLink
                        classNames={NavLinkClassNames}
                        component={Link}
                        to="security"
                        label="Security"
                        rightSection={<CaretRight size={16} weight="bold" />}
                    />
                    <NavLink
                        classNames={NavLinkClassNames}
                        component={Link}
                        to="payment-information"
                        label="Payment Information"
                        rightSection={<CaretRight size={16} weight="bold" />}
                    />
                    <NavLink
                        classNames={NavLinkClassNames}
                        component={Link}
                        to="order-history"
                        label="Order History"
                        rightSection={<CaretRight size={16} weight="bold" />}
                    />
                    <NavLink
                        classNames={NavLinkClassNames}
                        component={Link}
                        to="subscriptions"
                        label="Subscriptions"
                        rightSection={<CaretRight size={16} weight="bold" />}
                    />
                </nav>
                <div className={styles["content"]}>
                    <Outlet />
                </div>
            </div>
        </section>
    );
}

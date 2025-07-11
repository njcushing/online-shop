import { useLocation, Outlet, Link } from "react-router-dom";
import { useMatches, Breadcrumbs, NavLink, NavLinkProps } from "@mantine/core";
import { CaretRight } from "@phosphor-icons/react";
import { ErrorPage } from "@/pages/ErrorPage";
import { PersonalInformation } from "./components/PersonalInformation";
import { Addresses } from "./components/Addresses";
import { Security } from "./components/Security";
import { OrderHistory } from "./components/OrderHistory";
import styles from "./index.module.css";

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
    /* Split includes empty string for part of URL before first '/'; slicing it off here */
    const groupNames = pathname.split("/").slice(1);
    const currentGroup = groupNames.at(-1);
    const atBase = currentGroup === "account";

    const wide = useMatches({ base: false, lg: true });

    return (
        <section className={styles["account-details"]}>
            <div className={styles["account-details-width-controller"]}>
                <Breadcrumbs
                    component="nav"
                    separator="·"
                    classNames={{
                        separator: styles["group-breadcrumbs-separator"],
                        breadcrumb: styles["group-breadcrumb"],
                    }}
                >
                    <Link to="/">Home</Link>
                    {atBase ? (
                        <span className={styles["group-breadcrumb-current"]}>Account</span>
                    ) : (
                        <Link to="/account">Account</Link>
                    )}
                    {groupNames.slice(1).map((groupName, i) => {
                        const current = groupName === currentGroup;
                        const group = groups.find((g) => g.to === groupName);
                        const label = group?.label || groupName;

                        return !current ? (
                            <Link to={`/${[...groupNames.slice(0, i + 1)].join("/")}`} key={label}>
                                {label}
                            </Link>
                        ) : (
                            <span className={styles["group-breadcrumb-current"]} key={label}>
                                {label}
                            </span>
                        );
                    })}
                </Breadcrumbs>

                {(wide || atBase) && (
                    <nav className={styles["menu"]} data-at-base={atBase}>
                        {groups.map((group) => {
                            const { to, label } = group;
                            return (
                                <NavLink
                                    classNames={NavLinkClassNames}
                                    component={Link}
                                    to={to}
                                    label={label}
                                    rightSection={
                                        <CaretRight size={wide ? 16 : 14} weight="bold" />
                                    }
                                    data-selected={currentGroup === to}
                                    key={label}
                                />
                            );
                        })}
                    </nav>
                )}

                <div className={styles["content"]}>
                    <Outlet />
                </div>
            </div>
        </section>
    );
}

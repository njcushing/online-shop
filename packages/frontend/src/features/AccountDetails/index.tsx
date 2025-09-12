import { useLocation, Outlet, Link } from "react-router-dom";
import { useMatches, Breadcrumbs, NavLink, NavLinkProps } from "@mantine/core";
import { CaretRight } from "@phosphor-icons/react";
import styles from "./index.module.css";

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

    const [wide, caretSize] = useMatches({ base: [false, 14], lg: [true, 16] });

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
                    {groupNames.slice(1).map((groupName) => {
                        const group = groups.find((g) => g.to === groupName);
                        const { label } = group!;

                        return (
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
                                    rightSection={<CaretRight size={caretSize} weight="bold" />}
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

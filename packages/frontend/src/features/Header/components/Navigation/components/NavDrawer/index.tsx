import { Link } from "react-router-dom";
import { Drawer, NavLink } from "@mantine/core";
import { Logo } from "@/features/Logo";
import { CaretRight } from "@phosphor-icons/react";
import { categories } from "@/utils/products/categories";
import { getIcon } from "./utils/getIcon";
import styles from "./index.module.css";

export type TNavDrawer = {
    opened?: boolean;
    onClose?: () => unknown;
};

export function NavDrawer({ opened = false, onClose }: TNavDrawer) {
    return (
        <Drawer
            opened={opened}
            onClose={() => onClose && onClose()}
            title={<Logo onClick={() => onClose && onClose()} />}
            classNames={{
                root: styles["drawer-root"],
                content: styles["drawer-content"],
                header: styles["drawer-header"],
                body: styles["drawer-body"],
            }}
        >
            {categories.map((category) => {
                const { name, slug } = category;
                return (
                    <NavLink
                        component={Link}
                        to={`/c/${slug}`}
                        label={name}
                        leftSection={getIcon(name)}
                        rightSection={<CaretRight size={24} />}
                        onClick={() => onClose && onClose()}
                        classNames={{
                            label: styles["nav-link-label"],
                        }}
                        style={{ flexShrink: 0 }}
                        key={`navlink-category-${name}`}
                    />
                );
            })}
        </Drawer>
    );
}

import { useContext, useMemo } from "react";
import { RootContext } from "@/pages/Root";
import { Link } from "react-router-dom";
import { Drawer, Skeleton, NavLink } from "@mantine/core";
import { Logo } from "@/features/Logo";
import { CaretRight, Placeholder } from "@phosphor-icons/react";
import { skeletonCategories, buildCategoryTree } from "@/utils/products/categories";
import { getIcon } from "./utils/getIcon";
import styles from "./index.module.css";

export type TNavDrawer = {
    opened?: boolean;
    onClose?: () => unknown;
};

export function NavDrawer({ opened = false, onClose }: TNavDrawer) {
    const { categories } = useContext(RootContext);
    const { response, awaiting } = categories;

    const data = !awaiting ? response.data : skeletonCategories;

    const categoryTree = useMemo<ReturnType<typeof buildCategoryTree>>(() => {
        return buildCategoryTree(data || []);
    }, [data]);

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
                close: styles["drawer-close"],
            }}
        >
            {categoryTree.map((category) => {
                const { name, slug } = category;
                return (
                    <NavLink
                        component={Link}
                        to={`/c/${slug}`}
                        label={
                            <Skeleton visible={awaiting} height="24px">
                                <div style={{ visibility: awaiting ? "hidden" : "initial" }}>
                                    {name}
                                </div>
                            </Skeleton>
                        }
                        leftSection={
                            <Skeleton visible={awaiting} height="24px">
                                <div style={{ visibility: awaiting ? "hidden" : "initial" }}>
                                    {getIcon(name) || <Placeholder weight="fill" size={24} />}
                                </div>
                            </Skeleton>
                        }
                        rightSection={
                            <CaretRight size={24} style={{ opacity: !awaiting ? 1 : 0.3 }} />
                        }
                        onClick={() => onClose && onClose()}
                        disabled={awaiting}
                        classNames={{
                            root: styles["nav-link-root"],
                            label: styles["nav-link-label"],
                        }}
                        style={{ flexShrink: 0, opacity: 1 }}
                        key={`navlink-category-${name}`}
                    />
                );
            })}
        </Drawer>
    );
}

import { Fragment, useContext, useMemo } from "react";
import { CategoryContext } from "@/pages/Category";
import { useMantineTheme, Divider, NavLink } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { CaretRight } from "@phosphor-icons/react";
import { Product } from "./components/Product";
import styles from "./index.module.css";

export function ProductList() {
    const theme = useMantineTheme();

    const breakpointLg = useMediaQuery(`(max-width: ${theme.breakpoints.lg})`);
    const breakpointMd = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
    const breakpointXs = useMediaQuery(`(max-width: ${theme.breakpoints.xxs})`);

    const { urlPathSplit, categoryData } = useContext(CategoryContext);

    const currentCategory = useMemo(() => {
        return categoryData.length > 0 ? categoryData[categoryData.length - 1] : undefined;
    }, [categoryData]);
    if (!currentCategory) return null;

    const { subcategories, products } = currentCategory;

    return (
        <section className={styles["product-list"]}>
            <div className={styles["product-list-width-controller"]}>
                {products && products.length > 0 && (
                    <div className={styles["product-list-category-group"]}>
                        {products.map((product) => (
                            <Product productData={product} key={product.id} />
                        ))}
                    </div>
                )}
                {subcategories &&
                    subcategories.length > 0 &&
                    subcategories.map((subcategory, i) => {
                        if (!subcategory.products) return null;
                        if (subcategory.products.length === 0) return null;

                        let productsToDisplay = 7;
                        if (breakpointLg) productsToDisplay = 5;
                        if (breakpointMd) productsToDisplay = 5;
                        if (breakpointXs) productsToDisplay = 3;

                        return (
                            <Fragment key={subcategory.name}>
                                <div className={styles["product-list-category-group"]}>
                                    <div className={styles["subcategory-information"]}>
                                        <h2 className={styles["subcategory-name"]}>
                                            {subcategory.name}
                                        </h2>
                                        <p className={styles["subcategory-description"]}>
                                            {subcategory.description}
                                        </p>
                                        <NavLink
                                            component={Link}
                                            to={[...urlPathSplit, subcategory.slug].join("/")}
                                            label="Shop all"
                                            rightSection={<CaretRight size={16} />}
                                            style={{
                                                flexShrink: 0,
                                                padding: "8px",
                                                marginLeft: "-8px",
                                                width: "calc(100% + 8px)",
                                            }}
                                        />
                                    </div>
                                    {subcategory.products
                                        .slice(0, productsToDisplay)
                                        .map((product) => (
                                            <Product productData={product} key={product.id} />
                                        ))}
                                </div>
                                {i < currentCategory.subcategories!.length - 1 && <Divider />}
                            </Fragment>
                        );
                    })}
            </div>
        </section>
    );
}

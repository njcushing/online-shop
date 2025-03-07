import { useContext } from "react";
import { CategoryContext } from "@/pages/Category";
import { Breadcrumbs, Image } from "@mantine/core";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

export function CategoryBanner() {
    const { urlPathSplit, categoryData } = useContext(CategoryContext);

    const currentCategory = categoryData[categoryData.length - 1];
    const { name, description, subcategories } = currentCategory;

    return (
        <section className={styles["category-banner"]}>
            <Breadcrumbs
                component="nav"
                separator="·"
                classNames={{
                    separator: styles["category-breadcrumbs-separator"],
                    breadcrumb: styles["category-breadcrumb"],
                }}
            >
                <Link to="/">Home</Link>
                {categoryData.map((category, i) => {
                    const { slug, name: catName } = category;
                    const current = i === categoryData.length - 1;
                    return !current ? (
                        <Link to={slug} key={catName}>
                            {catName}
                        </Link>
                    ) : (
                        <span className={styles["category-breadcrumb-current"]} key={catName}>
                            {catName}
                        </span>
                    );
                })}
            </Breadcrumbs>

            <h1 className={styles["category-header"]}>{name}</h1>
            <p className={styles["category-description"]}>{description}</p>

            {subcategories && (
                <div className={styles["subcategory-links"]}>
                    {subcategories.map((subcategory) => {
                        const { slug, name: catName, img } = subcategory;
                        return (
                            <Link
                                to={[...urlPathSplit, slug].join("/")}
                                key={catName}
                                className={styles["subcategory-link"]}
                            >
                                <Image
                                    radius="md"
                                    src={img || ""}
                                    w={120}
                                    h={120}
                                    className={styles["subcategory-link-image"]}
                                />
                                {catName}
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

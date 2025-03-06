import { Breadcrumbs, Image } from "@mantine/core";
import { Link } from "react-router-dom";
import styles from "./index.module.css";

const pathFromHome = [
    { title: "Home", to: "/" },
    { title: "Category", to: "/c/category" },
];

const subcategories = [
    { title: "Subcategory 1", to: "subcategory-1", img: "" },
    { title: "Subcategory 2", to: "subcategory-2", img: "" },
    { title: "Subcategory 3", to: "subcategory-3", img: "" },
    { title: "Subcategory 4", to: "subcategory-4", img: "" },
    { title: "Subcategory 5", to: "subcategory-5", img: "" },
    { title: "Subcategory 6", to: "subcategory-6", img: "" },
    { title: "Subcategory 7", to: "subcategory-7", img: "" },
    { title: "Subcategory 8", to: "subcategory-8", img: "" },
    { title: "Subcategory 9", to: "subcategory-9", img: "" },
];

export function CategoryBanner() {
    return (
        <div className={styles["category-banner"]}>
            <Breadcrumbs>
                {pathFromHome.map((item) => {
                    const { title, to } = item;
                    return (
                        <Link to={to} key={title} className={styles["category-breadcrumb"]}>
                            {title}
                        </Link>
                    );
                })}
            </Breadcrumbs>

            <h1 className={styles["category-header"]}>Category Header</h1>
            <p className={styles["category-description"]}>Category description</p>

            <div className={styles["subcategory-links"]}>
                {subcategories.map((item) => {
                    const { title, to, img } = item;
                    return (
                        <Link to={to} key={title} className={styles["subcategory-link"]}>
                            <Image
                                radius="md"
                                src={img}
                                w={120}
                                h={120}
                                className={styles["subcategory-link-image"]}
                            />
                            {title}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

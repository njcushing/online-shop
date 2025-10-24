import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RootContext } from "@/pages/Root";
import { CategoryContext } from "@/pages/Category";
import { skeletonCategories } from "@/utils/products/categories";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { Breadcrumbs, Skeleton, Image } from "@mantine/core";
import styles from "./index.module.css";

export function CategoryHero() {
    const navigate = useNavigate();

    const { categories } = useContext(RootContext);
    const { urlPathSplit, categoryBranch } = useContext(CategoryContext);

    let currentCategoryBranch = skeletonCategories;

    const { data, awaitingAny } = useQueryContexts({
        contexts: [{ name: "categories", context: categories }],
    });

    if (!awaitingAny) {
        if (data.categories) currentCategoryBranch = categoryBranch;
    }

    if (currentCategoryBranch.length === 0) throw new Error("Category not found at this location");
    const currentCategory = currentCategoryBranch.at(-1)!;
    const { name, description, subcategories } = currentCategory;

    return (
        <section className={styles["category-hero"]}>
            <div className={styles["category-hero-width-controller"]}>
                <Breadcrumbs
                    component="nav"
                    separator="·"
                    classNames={{ separator: styles["category-breadcrumbs-separator"] }}
                >
                    <Skeleton visible={awaitingAny} width="min-content">
                        <button
                            type="button"
                            className={styles["category-breadcrumb-button"]}
                            onClick={() => navigate("/")}
                            disabled={awaitingAny}
                            style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                        >
                            Home
                        </button>
                    </Skeleton>

                    {categoryBranch.map((category, i) => {
                        const { name: catName } = category;
                        const current = i === categoryBranch.length - 1;
                        const path = `/c/${[...urlPathSplit.slice(0, i + 1)].join("/")}`;
                        return !current ? (
                            <Skeleton visible={awaitingAny} width="min-content" key={catName}>
                                <button
                                    type="button"
                                    className={styles["category-breadcrumb-button"]}
                                    onClick={() => navigate(path)}
                                    disabled={awaitingAny}
                                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                >
                                    {catName}
                                </button>
                            </Skeleton>
                        ) : (
                            <Skeleton visible={awaitingAny} width="min-content" key={catName}>
                                <span
                                    className={styles["category-breadcrumb-current"]}
                                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                                >
                                    {catName}
                                </span>
                            </Skeleton>
                        );
                    })}
                </Breadcrumbs>

                <Skeleton visible={awaitingAny} width={awaitingAny ? "min-content" : "100%"}>
                    <h1
                        className={styles["category-header"]}
                        style={{
                            visibility: awaitingAny ? "hidden" : "initial",
                            textWrap: awaitingAny ? "nowrap" : "initial",
                        }}
                    >
                        {name}
                    </h1>
                </Skeleton>

                <Skeleton visible={awaitingAny} width={awaitingAny ? "min-content" : "100%"}>
                    <p
                        className={styles["category-description"]}
                        style={{
                            visibility: awaitingAny ? "hidden" : "initial",
                            textWrap: awaitingAny ? "nowrap" : "initial",
                        }}
                    >
                        {description}
                    </p>
                </Skeleton>

                {subcategories && (
                    <nav className={styles["subcategory-links"]}>
                        {subcategories.map((subcategory) => {
                            const { slug, name: catName /* , img */ } = subcategory;
                            return (
                                <button
                                    type="button"
                                    onClick={() => navigate(slug)}
                                    disabled={awaitingAny}
                                    className={styles["subcategory-link"]}
                                    key={catName}
                                >
                                    <Skeleton visible={awaitingAny}>
                                        <Image
                                            radius="md"
                                            // src={img?.src}
                                            // alt={img?.alt}
                                            w={120}
                                            h={120}
                                            className={styles["subcategory-link-image"]}
                                            style={{
                                                visibility: awaitingAny ? "hidden" : "initial",
                                            }}
                                        />
                                    </Skeleton>

                                    <Skeleton visible={awaitingAny}>
                                        <p
                                            style={{
                                                visibility: awaitingAny ? "hidden" : "initial",
                                            }}
                                        >
                                            {catName}
                                        </p>
                                    </Skeleton>
                                </button>
                            );
                        })}
                    </nav>
                )}
            </div>
        </section>
    );
}

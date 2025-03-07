import { createContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Pages } from "@/pages";
import { CategoryBanner } from "@/features/CategoryBanner";
import { categories, Category as CategoryDataType } from "@/utils/products/categories";
import styles from "./index.module.css";

export interface ICategoryContext {
    urlPathFull: string;
    urlPathSplit: string[];
    categoryData: CategoryDataType[];
}

export const defaultCategoryContext: ICategoryContext = {
    urlPathFull: "",
    urlPathSplit: [],
    categoryData: [],
};

export const CategoryContext = createContext<ICategoryContext>(defaultCategoryContext);

const validatePath = (
    stage: number,
    urlPathSplit: string[],
    currentCategories: CategoryDataType[],
    categoriesArray: CategoryDataType[],
): CategoryDataType[] | null => {
    if (stage === urlPathSplit.length) return null;

    const slug = urlPathSplit[stage];
    const categoryIndex = categoriesArray.findIndex((category) => category.slug === slug);
    if (categoryIndex > -1) {
        const foundCategory = categoriesArray[categoryIndex];
        const newCategories = [...currentCategories, categoriesArray[categoryIndex]];
        if (stage === urlPathSplit.length - 1) return newCategories;
        if (!foundCategory.subcategories) return null;
        return validatePath(stage + 1, urlPathSplit, newCategories, foundCategory.subcategories);
    }

    return null;
};

export function Category() {
    const { "*": urlPathFull } = useParams();
    const urlPathSplit = useMemo(() => (urlPathFull ? urlPathFull.split("/") : []), [urlPathFull]);

    const categoryData = useMemo(() => {
        return validatePath(0, urlPathSplit, [], categories) || [];
    }, [urlPathSplit]);

    const contextValue = useMemo<ICategoryContext>(() => {
        return { urlPathFull: urlPathFull || "", urlPathSplit, categoryData };
    }, [urlPathFull, urlPathSplit, categoryData]);

    if (categoryData.length === 0) return <Pages.ErrorPage />;

    return (
        <CategoryContext.Provider value={contextValue}>
            <div className={styles["page"]}>
                <CategoryBanner />
            </div>
        </CategoryContext.Provider>
    );
}

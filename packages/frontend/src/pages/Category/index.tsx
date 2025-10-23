import { createContext, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CategoryHero } from "@/features/CategoryHero";
import { ProductList } from "@/features/ProductList";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { buildCategoryTree } from "@/utils/products/categories";
import { RootContext } from "../Root";
import styles from "./index.module.css";

export interface ICategoryContext {
    urlPathFull: string;
    urlPathSplit: string[];
    categoryTree: ReturnType<typeof buildCategoryTree>;
    categoryBranch: ReturnType<typeof buildCategoryTree>;
}

export const defaultCategoryContext: ICategoryContext = {
    urlPathFull: "",
    urlPathSplit: [],
    categoryTree: [],
    categoryBranch: [],
};

export const CategoryContext = createContext<ICategoryContext>(defaultCategoryContext);

const findCurrentBranch = (
    urlPathSplit: ICategoryContext["urlPathSplit"],
    currentBranch: ICategoryContext["categoryTree"],
    nextBranch: ICategoryContext["categoryTree"][number]["subcategories"],
): ICategoryContext["categoryBranch"] => {
    if (urlPathSplit.length === 0) return [];

    const slug = urlPathSplit[0];
    const foundBranch = nextBranch.find((c) => c.slug === slug);
    if (foundBranch) {
        const newCurrentBranch = [...currentBranch, foundBranch];
        if (urlPathSplit.length === 1) return newCurrentBranch;
        return findCurrentBranch(
            urlPathSplit.slice(1),
            newCurrentBranch,
            foundBranch.subcategories,
        );
    }

    return [];
};

export type TCategory = {
    children?: React.ReactNode;
};

export function Category({ children }: TCategory) {
    const { categories } = useContext(RootContext);

    let categoriesData = null;

    const { data, awaitingAny } = useQueryContexts({
        contexts: [{ name: "categories", context: categories }],
    });

    if (!awaitingAny) {
        if (data.categories) categoriesData = data.categories;
    }

    const { "*": urlPathFull } = useParams();
    const urlPathSplit = useMemo(() => (urlPathFull ? urlPathFull.split("/") : []), [urlPathFull]);

    const categoryTree = useMemo<ICategoryContext["categoryTree"]>(() => {
        return buildCategoryTree(categoriesData || []);
    }, [categoriesData]);

    const categoryBranch = useMemo<ICategoryContext["categoryBranch"]>(() => {
        return findCurrentBranch(urlPathSplit, [], categoryTree);
    }, [urlPathSplit, categoryTree]);

    const contextValue = useMemo<ICategoryContext>(() => {
        return { urlPathFull: urlPathFull || "", urlPathSplit, categoryTree, categoryBranch };
    }, [urlPathFull, urlPathSplit, categoryTree, categoryBranch]);

    if (!awaitingAny && !categoryBranch) {
        throw new Response("Category not found", { status: 404 });
    }

    return (
        <CategoryContext.Provider value={contextValue}>
            <div className={styles["page"]}>
                <CategoryHero />
                <ProductList />
            </div>
            {children}
        </CategoryContext.Provider>
    );
}

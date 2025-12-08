import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CategoryHero } from "@/features/CategoryHero";
import { CategoryProductList } from "@/features/CategoryProductList";
import * as useAsync from "@/hooks/useAsync";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { buildCategoriesTree } from "@/utils/products/categories";
import { getCategoryBySlug } from "@/api/categories/[slug]/GET";
import { createQueryContextObject } from "@/hooks/useAsync/utils/createQueryContextObject";
import { RootContext } from "../Root";
import styles from "./index.module.css";

export interface ICategoryContext {
    urlPathFull: string;
    urlPathSplit: string[];
    categoryTree: ReturnType<typeof buildCategoriesTree>;
    categoryBranch: ReturnType<typeof buildCategoriesTree>;
    categoryData: useAsync.InferUseAsyncReturnTypeFromFunction<typeof getCategoryBySlug>;
}

export const defaultCategoryContext: ICategoryContext = {
    urlPathFull: "",
    urlPathSplit: [],
    categoryTree: [],
    categoryBranch: [],
    categoryData: createQueryContextObject({ response: { success: true }, awaiting: true }),
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
    const { "*": urlPathFull } = useParams();
    const urlPathSplit = useMemo(() => (urlPathFull ? urlPathFull.split("/") : []), [urlPathFull]);

    const { categories } = useContext(RootContext);

    let categoriesData = null;

    const { data, awaitingAny } = useQueryContexts({
        contexts: [{ name: "categories", context: categories }],
    });

    if (!awaitingAny) {
        if (data.categories) categoriesData = data.categories;
    }

    const [categoryData, setCategoryData] = useState<ICategoryContext["categoryData"]>(
        defaultCategoryContext.categoryData,
    );
    const getCategoryReturn = useAsync.GET(
        getCategoryBySlug,
        [{ params: { path: { slug: urlPathSplit.at(-1)! } } }] as Parameters<
            typeof getCategoryBySlug
        >,
        { attemptOnMount: !awaitingAny },
    );
    useEffect(() => setCategoryData(getCategoryReturn), [getCategoryReturn]);
    const { setParams, attempt } = getCategoryReturn;
    useEffect(() => {
        setParams([{ params: { path: { slug: urlPathSplit.at(-1)! } } }]);
        attempt();
    }, [urlPathSplit, setParams, attempt]);

    const categoryTree = useMemo<ICategoryContext["categoryTree"]>(() => {
        return buildCategoriesTree(categoriesData || []);
    }, [categoriesData]);

    const categoryBranch = useMemo<ICategoryContext["categoryBranch"]>(() => {
        return findCurrentBranch(urlPathSplit, [], categoryTree);
    }, [urlPathSplit, categoryTree]);

    const contextValue = useMemo<ICategoryContext>(() => {
        return {
            urlPathFull: urlPathFull || "",
            urlPathSplit,
            categoryTree,
            categoryBranch,
            categoryData,
        };
    }, [urlPathFull, urlPathSplit, categoryTree, categoryBranch, categoryData]);

    if (!awaitingAny && !categoryBranch) {
        throw new Response("Category not found", { status: 404 });
    }

    const categoryHero = useMemo(() => {
        return <CategoryHero />;
    }, []);

    const categoryProductList = useMemo(() => {
        return <CategoryProductList />;
    }, []);

    return (
        <CategoryContext.Provider value={contextValue}>
            <div className={styles["page"]}>
                {categoryHero}
                {categoryProductList}
            </div>
            {children}
        </CategoryContext.Provider>
    );
}

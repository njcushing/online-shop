import { RecursivePartial } from "@/utils/types";
import { ICategoryContext } from ".";

export const mockCategories: RecursivePartial<ICategoryContext["categoryData"]> = [
    {
        slug: "category-1-slug",
        name: "Category 1",
        description: "Category 1 description",
        subcategories: [
            {
                slug: "category-1-subcategory-1-slug",
                name: "Category 1 Subcategory 1",
                description: "Category 1 Subcategory 1 description",
                products: ["1", "2", "3"],
            },
            {
                slug: "category-1-subcategory-2-slug",
                name: "Category 1 Subcategory 2",
                description: "Category 1 Subcategory 2 description",
                products: ["4", "5", "6"],
            },
        ],
    },
    {
        slug: "category-2-slug",
        name: "Category 2",
        description: "Category 2 description",
        subcategories: [
            {
                slug: "category-2-subcategory-1-slug",
                name: "Category 2 Subcategory 1",
                description: "Category 2 Subcategory 1 description",
                products: ["7", "8", "9"],
            },
            {
                slug: "category-2-subcategory-2-slug",
                name: "Category 2 Subcategory 2",
                description: "Category 2 Subcategory 2 description",
                products: ["10", "11", "12"],
            },
        ],
    },
];

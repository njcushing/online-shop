import { v4 as uuid } from "uuid";
import { components } from "@/api/schema";

export type CategoryDto = components["schemas"]["CategoryDto"];
export type CategoryDtoWithSubcategories = CategoryDto & {
    subcategories: CategoryDtoWithSubcategories[];
};

export const skeletonCategories: CategoryDtoWithSubcategories[] = [
    {
        id: uuid(),
        slug: "default-category-1",
        name: "Default Cat 1",
        description: "Default Category 1 description",
        subcategories: [
            {
                id: uuid(),
                slug: "default-category-6",
                name: "Default Cat 6",
                description: "Default Category 6 description",
                subcategories: [],
            },
            {
                id: uuid(),
                slug: "default-category-7",
                name: "Default Cat 7",
                description: "Default Category 7 description",
                subcategories: [],
            },
            {
                id: uuid(),
                slug: "default-category-8",
                name: "Default Cat 8",
                description: "Default Category 8 description",
                subcategories: [],
            },
            {
                id: uuid(),
                slug: "default-category-9",
                name: "Default Cat 9",
                description: "Default Category 9 description",
                subcategories: [],
            },
        ],
    },
    {
        id: uuid(),
        slug: "default-category-2",
        name: "Default Cat 2",
        description: "Default Category 2 description",
        subcategories: [],
    },
    {
        id: uuid(),
        slug: "default-category-3",
        name: "Default Cat 3",
        description: "Default Category 3 description",
        subcategories: [],
    },
    {
        id: uuid(),
        slug: "default-category-4",
        name: "Default Cat 4",
        description: "Default Category 4 description",
        subcategories: [],
    },
    {
        id: uuid(),
        slug: "default-category-5",
        name: "Default Cat 5",
        description: "Default Category 5 description",
        subcategories: [],
    },
];

export const buildCategoryTree = (categoryData: CategoryDto[]): CategoryDtoWithSubcategories[] => {
    const categoryMap = new Map<string, CategoryDtoWithSubcategories>();
    categoryData.forEach((c) => categoryMap.set(c.id, { ...c, subcategories: [] }));

    const categoryTree: CategoryDtoWithSubcategories[] = [];

    categoryMap.forEach((c) => {
        const parentCategory = c.parentId ? categoryMap.get(c.parentId) : null;
        if (parentCategory) {
            parentCategory.subcategories.push(c);
        } else {
            categoryTree.push(c);
        }
    });

    return categoryTree;
};

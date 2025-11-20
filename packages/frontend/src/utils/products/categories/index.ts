import { v4 as uuid } from "uuid";
import { components } from "@/api/schema";

export type CategoriesDto = components["schemas"]["Categories.GET.GetCategoriesResponseDto"];
export type CategoriesDtoWithSubcategories = CategoriesDto & {
    subcategories: CategoriesDtoWithSubcategories[];
};

export const skeletonCategories: CategoriesDtoWithSubcategories[] = [
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
            {
                id: uuid(),
                slug: "default-category-10",
                name: "Default Cat 10",
                description: "Default Category 10 description",
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
        subcategories: [
            {
                id: uuid(),
                slug: "default-category-11",
                name: "Default Cat 11",
                description: "Default Category 11 description",
                subcategories: [],
            },
            {
                id: uuid(),
                slug: "default-category-12",
                name: "Default Cat 12",
                description: "Default Category 12 description",
                subcategories: [],
            },
            {
                id: uuid(),
                slug: "default-category-13",
                name: "Default Cat 13",
                description: "Default Category 13 description",
                subcategories: [],
            },
            {
                id: uuid(),
                slug: "default-category-14",
                name: "Default Cat 14",
                description: "Default Category 14 description",
                subcategories: [],
            },
            {
                id: uuid(),
                slug: "default-category-15",
                name: "Default Cat 15",
                description: "Default Category 15 description",
                subcategories: [],
            },
        ],
    },
];

export const buildCategoriesTree = (
    categoriesData: CategoriesDto[],
): CategoriesDtoWithSubcategories[] => {
    const categoriesMap = new Map<string, CategoriesDtoWithSubcategories>();
    categoriesData.forEach((c) => categoriesMap.set(c.id, { ...c, subcategories: [] }));

    const categoriesTree: CategoriesDtoWithSubcategories[] = [];

    categoriesMap.forEach((c) => {
        const parentCategory = c.parentId ? categoriesMap.get(c.parentId) : null;
        if (parentCategory) {
            parentCategory.subcategories.push(c);
        } else {
            categoriesTree.push(c);
        }
    });

    return categoriesTree;
};

export type GetCategoryBySlugResponseDto =
    components["schemas"]["Categories._Slug.GET.GetCategoryBySlugResponseDto"];

export const skeletonCategory: GetCategoryBySlugResponseDto = {
    name: "Default Cat 1",
    slug: "default-category-1",
    description: "Default Category 1 description",
    subcategories: [
        {
            slug: "default-category-2",
            name: "Default Cat 2",
            description: "Default Category 2 description",
        },
        {
            slug: "default-category-3",
            name: "Default Cat 3",
            description: "Default Category 3 description",
        },
        {
            slug: "default-category-4",
            name: "Default Cat 4",
            description: "Default Category 4 description",
        },
        {
            slug: "default-category-5",
            name: "Default Cat 5",
            description: "Default Category 5 description",
        },
    ],
    productCount: 10,
};

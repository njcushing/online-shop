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
    filters: [
        {
            name: "Filter_String",
            title: "Filter String",
            type: "string",
            values: [
                { position: 1, code: "A2", name: "A2 Name", value: "A2 Value", count: 10 },
                { position: 4, code: "A5", name: "A5 Name", value: "A5 Value", count: 10 },
                { position: 0, code: "A1", name: "A1 Name", value: "A1 Value", count: 10 },
                { position: 2, code: "A3", name: "A3 Name", value: "A3 Value", count: 10 },
                { position: 3, code: "A4", name: "A4 Name", value: "A4 Value", count: 10 },
            ],
        },
        {
            name: "Filter_Numeric",
            title: "Filter Numeric",
            type: "numeric",
            values: [
                { position: 2, code: "B3", name: "B3 Name", value: "30", count: 10 },
                { position: 4, code: "B5", name: "B5 Name", value: "50", count: 10 },
                { position: 0, code: "B1", name: "B1 Name", value: "10", count: 10 },
                { position: 1, code: "B2", name: "B2 Name", value: "20", count: 10 },
                { position: 3, code: "B4", name: "B4 Name", value: "40", count: 10 },
            ],
        },
        {
            name: "Filter_Color",
            title: "Filter Color",
            type: "color",
            values: [
                { position: 1, code: "C2", name: "C2 Name", value: "#E7A67A", count: 10 },
                { position: 0, code: "C1", name: "C1 Name", value: "#FFECDA", count: 10 },
                { position: 2, code: "C3", name: "C3 Name", value: "#945A38", count: 10 },
                { position: 4, code: "C5", name: "C5 Name", value: "#251515", count: 10 },
                { position: 3, code: "C4", name: "C4 Name", value: "#523727", count: 10 },
            ],
        },
    ],
    productCount: 10,
};

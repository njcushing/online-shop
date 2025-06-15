import { RecursivePartial } from "@/utils/types";
import { Category } from "@/utils/products/categories";

export const mockCategories: RecursivePartial<Category>[] = [
    { slug: "category1", name: "Category 1 Name" },
    { slug: "category2", name: "Category 2 Name" },
    { slug: "category3", name: "Category 3 Name" },
    { slug: "category4", name: "Category 4 Name" },
    { slug: "category5", name: "Category 5 Name" },
];

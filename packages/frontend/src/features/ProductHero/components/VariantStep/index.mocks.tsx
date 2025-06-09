import { ProductVariantOption } from "@/utils/products/product";

export const mockVariantOptions: ProductVariantOption[] = [
    {
        id: "variantOption1",
        name: "Variant Option 1",
        title: "Choose a variant option 1",
        type: "dot",
        values: [
            { id: "variantOption1Value1", name: "Value 1", dot: "#000" },
            { id: "variantOption1Value2", name: "Value 2", dot: "#000" },
        ],
    },
];

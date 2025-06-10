import { ProductVariantOption } from "@/utils/products/product";

export const mockVariantOptions: ProductVariantOption[] = [
    {
        id: "variantOption1",
        name: "Variant Option 1",
        title: "Choose a variant option 1",
        type: "dot",
        values: [
            { id: "variantOption1Value1", name: "Option 1 Value 1", dot: "#ffffff" },
            // @ts-expect-error - Disabling type checking for unit test mock
            { id: "variantOption1Value2", name: "Option 1 Value 2" },
        ],
    },
    {
        id: "variantOption2",
        name: "Variant Option 2",
        title: "Choose a variant option 2",
        type: "image",
        values: [
            {
                id: "variantOption2Value1",
                name: "Option 2 Value 1",
                image: { src: "variantOption2Value1ImgSrc", alt: "variantOption2Value1ImgAlt" },
            },
            {
                id: "variantOption2Value2",
                name: "Option 2 Value 2",
                image: { src: "variantOption2Value2ImgSrc", alt: "variantOption2Value2ImgAlt" },
            },
        ],
    },
];

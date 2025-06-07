import { Product, ProductVariant } from "@/utils/products/product";
import { PopulatedCartItemData } from "@/utils/products/cart";
import { calculateMaxAddableVariantStock } from ".";

const mockVariants: ProductVariant[] = [
    // Only using fields relevant to the 'calculateMaxAddableVariantStock' function
    { id: "variant1Id", stock: 10, allowanceOverride: 5 },
    { id: "variant2Id", stock: 20 },
    { id: "variant3Id", stock: 2 },
    { id: "variant4Id", stock: 50, allowanceOverride: 20 },
    { id: "variant5Id", stock: 30 },
] as ProductVariant[];

const mockProduct: Product = {
    // Only using fields relevant to the 'calculateMaxAddableVariantStock' function
    id: "productId",
    allowance: 10,
    variants: mockVariants,
} as Product;

const mockCart: PopulatedCartItemData[] = [
    // Only using fields relevant to the 'calculateMaxAddableVariantStock' function
    {
        product: { id: "productId" },
        variant: { id: "variant1Id" },
        quantity: 2,
    },
    {
        product: { id: "productId" },
        variant: { id: "variant3Id" },
        quantity: 6,
    },
    {
        product: { id: "productId" },
        variant: { id: "variant5Id" },
        quantity: 12,
    },
] as PopulatedCartItemData[];

describe("The 'calculateMaxAddableVariantStock' function...", () => {
    test("Should return the correct addable maximum stock for a product's variant", () => {
        expect(calculateMaxAddableVariantStock(mockCart, mockProduct, mockVariants[0])).toBe(3);
        expect(calculateMaxAddableVariantStock(mockCart, mockProduct, mockVariants[1])).toBe(10);
        expect(calculateMaxAddableVariantStock(mockCart, mockProduct, mockVariants[2])).toBe(0);
        expect(calculateMaxAddableVariantStock(mockCart, mockProduct, mockVariants[3])).toBe(20);
        expect(calculateMaxAddableVariantStock(mockCart, mockProduct, mockVariants[4])).toBe(0);
    });
});

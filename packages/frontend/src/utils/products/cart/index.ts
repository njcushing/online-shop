import { Product } from "@/utils/products/product";

export type CartItemData = {
    id: Product["id"];
    variant: Product["variants"][number]["id"];
    quantity: number;
};

export const mockCart: CartItemData[] = [
    { id: "1", variant: "1-1", quantity: 10 },
    { id: "1", variant: "1-2", quantity: 5 },
    { id: "2", variant: "2-2", quantity: 15 },
    { id: "3", variant: "2-1", quantity: 6 },
    { id: "3", variant: "2-3", quantity: 18 },
];

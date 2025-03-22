import { Product } from "@/utils/products/product";

export type CartItemData = {
    id: Product["id"];
    variant: Product["variants"][number]["id"];
    quantity: number;
};

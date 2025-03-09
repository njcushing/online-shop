import dayjs from "dayjs";
import { loremIpsum } from "lorem-ipsum";
import { v4 as uuid } from "uuid";

export type Product = {
    id: string;
    name: string;
    description: string[];
    img: string;
    price: {
        current: number;
        base: number;
    };
    rating: {
        value: number;
        quantity: number;
    };
    stock: number;
    releaseDate: string;
};

export const generateMockProduct = (): Product => {
    const basePrice = Math.floor(Math.random() * 16000 + 6000);

    return {
        id: uuid(),
        name: "Product Name",
        description: Array.from({ length: Math.floor(Math.random() * 4) + 1 }).map(() => {
            return loremIpsum({ count: Math.floor(Math.random() * 3) + 2 });
        }),
        img: "",
        price: {
            current: Math.random() < 0.5 ? basePrice : Math.floor(basePrice * Math.random()),
            base: basePrice,
        },
        rating: {
            value: Math.random() * 2 + 3,
            quantity: Math.floor(Math.random() * 200 + 50),
        },
        stock: Math.floor(Math.random() * 100),
        releaseDate: dayjs(new Date())
            .subtract(Math.floor(Math.random() * 365), "day")
            .toISOString(),
    };
};

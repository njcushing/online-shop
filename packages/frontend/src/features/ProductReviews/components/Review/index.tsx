import { ProductReview } from "@/utils/products/product";
import styles from "./index.module.css";

export type TReview = {
    data: ProductReview;
};

export function Review({ data }: TReview) {
    return <div className={styles["review"]}></div>;
}

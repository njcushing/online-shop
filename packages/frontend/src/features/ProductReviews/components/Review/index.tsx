import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ProductReview } from "@/utils/products/product";
import styles from "./index.module.css";

export type TReview = {
    data: ProductReview;
};

export function Review({ data }: TReview) {
    const { comment } = data;

    return (
        <div className={styles["review"]}>
            <div className={styles["comment"]}>
                <div className={styles["markdown-container"]}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}

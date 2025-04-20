import { Rating } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dayjs from "dayjs";
import { ProductReview } from "@/utils/products/product";
import styles from "./index.module.css";

export type TReview = {
    data: ProductReview;
};

export function Review({ data }: TReview) {
    const { rating, comment, datePosted } = data;

    return (
        <div className={styles["review"]}>
            <Rating readOnly count={rating} value={rating} color="gold" size="lg" />
            <span className={styles["date-posted"]}>
                Posted by username on {dayjs(datePosted).format("MMMM D, YYYY")}
            </span>
            <div className={styles["comment"]}>
                <div className={styles["markdown-container"]}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}

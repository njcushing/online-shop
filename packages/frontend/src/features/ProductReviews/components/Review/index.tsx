import { Rating, Skeleton } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dayjs from "dayjs";
import { ProductReview } from "@/utils/products/product";
import styles from "./index.module.css";

export type TReview = {
    data: ProductReview;
    awaiting?: boolean;
};

export function Review({ data, awaiting = false }: TReview) {
    const { rating, comment, datePosted } = data;

    return (
        <div className={styles["review"]}>
            <Skeleton visible={awaiting} width="min-content">
                <Rating readOnly count={rating} value={rating} color="gold" size="md" />
            </Skeleton>
            <Skeleton visible={awaiting} width="20rem">
                <span className={styles["date-posted"]}>
                    Posted by username on {dayjs(datePosted).format("MMMM D, YYYY")}
                </span>
            </Skeleton>
            <Skeleton visible={awaiting} width="100%">
                <div className={styles["comment"]}>
                    <div className={styles["markdown-container"]}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment}</ReactMarkdown>
                    </div>
                </div>
            </Skeleton>
        </div>
    );
}

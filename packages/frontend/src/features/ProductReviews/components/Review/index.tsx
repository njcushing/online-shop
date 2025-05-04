import { Rating, Skeleton, SkeletonProps } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dayjs from "dayjs";
import { ProductReview } from "@/utils/products/product";
import styles from "./index.module.css";

export type TReview = {
    data?: ProductReview;
    awaiting?: boolean;
};

const SkeletonClassNames: SkeletonProps["classNames"] = {
    root: styles["skeleton-root"],
};

export function Review({ data, awaiting = false }: TReview) {
    if (!data && !awaiting) return null;

    if (awaiting) {
        return (
            <div className={styles["review"]}>
                <Skeleton
                    visible={!data || awaiting}
                    width="100px"
                    height="20px"
                    classNames={SkeletonClassNames}
                ></Skeleton>
                <Skeleton
                    visible={!data || awaiting}
                    width="20rem"
                    height="1.06rem"
                    classNames={SkeletonClassNames}
                ></Skeleton>
                <Skeleton
                    visible={!data || awaiting}
                    width="100%"
                    height="2rem"
                    classNames={SkeletonClassNames}
                ></Skeleton>
            </div>
        );
    }

    const { rating, comment, datePosted } = data!;

    return (
        <div className={styles["review"]}>
            <Rating readOnly count={rating} value={rating} color="gold" size="md" />
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

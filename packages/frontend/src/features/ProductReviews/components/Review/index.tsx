import { Rating, Skeleton } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dayjs from "dayjs";
import { ResponseBody as GetReviewsByProductSlugResponseDto } from "@/api/product/[slug]/reviews/GET";
import styles from "./index.module.css";

export type TReview = {
    data: GetReviewsByProductSlugResponseDto["reviews"][number];
    awaiting?: boolean;
};

export function Review({ data, awaiting = false }: TReview) {
    if (awaiting) {
        return (
            <div className={styles["review"]}>
                <Skeleton visible={!data || awaiting} width="100px" height="20px"></Skeleton>
                <Skeleton visible={!data || awaiting} width="20rem" height="1.06rem"></Skeleton>
                <Skeleton visible={!data || awaiting} width="100%" height="2rem"></Skeleton>
            </div>
        );
    }

    const { rating, description, createdAt } = data;

    return (
        <div className={styles["review"]}>
            <Rating readOnly count={rating} value={rating} color="gold" size="md" />
            <span className={styles["date-posted"]}>
                Posted by username on {dayjs(createdAt).format("MMMM D, YYYY")}
            </span>
            <div className={styles["description"]}>
                <div className={styles["markdown-container"]}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}

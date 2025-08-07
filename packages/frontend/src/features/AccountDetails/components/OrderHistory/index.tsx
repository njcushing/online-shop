import { useContext, useState, useEffect, useRef } from "react";
import { RootContext, IUserContext, UserContext } from "@/pages/Root";
import { useScrollIntoView } from "@mantine/hooks";
import { Skeleton, Divider, Pagination } from "@mantine/core";
import { v4 as uuid } from "uuid";
import { OrderSummary } from "./components/OrderSummary";
import styles from "./index.module.css";

const ordersPerPage = 10;

export function OrderHistory() {
    const { headerInfo } = useContext(RootContext);
    const { forceClose } = headerInfo;

    const { orders, defaultData } = useContext(UserContext);
    const { awaiting } = orders;

    const [page, setPage] = useState<number>(0);

    // Don't test auto-scroll logic
    /* v8 ignore start */

    const forceCloseId = useRef<string>(uuid());
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
        offset: 16 /* Top padding */,
        duration: 600,
        cancelable: false,
        easing: (t) => 1 - (1 - t) ** 2,
        onScrollFinish: () => forceClose(false, forceCloseId.current),
    });
    const [queueScroll, setQueueScroll] = useState<boolean>(false);
    useEffect(() => {
        if (!queueScroll) return undefined;

        // Ensure Review components' container repaints before smooth scroll to prevent jumping
        const rafId = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scrollIntoView();
                forceClose(true, forceCloseId.current);
                setQueueScroll(false);
            });
        });

        return () => {
            cancelAnimationFrame(rafId);
        };
    }, [forceClose, scrollIntoView, queueScroll]);
    useEffect(() => {
        const { current } = forceCloseId;
        return () => {
            forceClose(false, current);
        };
    }, [forceClose]);

    /* v8 ignore stop */

    const data = orders.data || (defaultData.orders as NonNullable<IUserContext["orders"]["data"]>);

    return (data && data.length > 0) || awaiting ? (
        <div className={styles["order-history-container"]} ref={targetRef}>
            <Skeleton visible={awaiting}>
                <p
                    className={styles["order-count"]}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                >
                    {data.length} orders
                </p>
            </Skeleton>

            <Divider className={styles["divider"]} />

            <ul className={styles["order-history"]}>
                {data
                    .slice(page * ordersPerPage, page * ordersPerPage + ordersPerPage)
                    .map((order) => {
                        const { id } = order;

                        return <OrderSummary data={order} key={id} />;
                    })}
            </ul>

            <Skeleton visible={awaiting}>
                <div
                    className={styles["pagination-container"]}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                >
                    <Pagination
                        // Adding data-testid attribute to test onChange logic; Pagination component
                        // doesn't have an accessible role and the page buttons' text content
                        // (numbers) often conflict with the other elements' text content.
                        data-testid="pagination"
                        total={Math.ceil(orders.data ? orders.data.length / ordersPerPage : 1)}
                        value={page + 1}
                        withEdges
                        onChange={(newPageNo) => {
                            setPage(newPageNo - 1);
                            setQueueScroll(true);
                        }}
                        disabled={awaiting}
                        classNames={{ control: styles["pagination-control"] }}
                    />
                </div>
            </Skeleton>
        </div>
    ) : (
        <p className={styles["no-order-history-message"]}>Nothing to show!</p>
    );
}

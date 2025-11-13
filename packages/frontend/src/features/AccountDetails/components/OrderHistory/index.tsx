import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { RootContext, UserContext } from "@/pages/Root";
import { useScrollIntoView } from "@mantine/hooks";
import { Skeleton, Divider, Pagination } from "@mantine/core";
import { v4 as uuid } from "uuid";
import { OrderData } from "@/utils/products/orders";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { OrderSummary } from "./components/OrderSummary";
import styles from "./index.module.css";

export const filterOptions = {
    "1_month": { optionName: "Past month" },
    "3_months": { optionName: "Past 3 months" },
    "6_months": { optionName: "Past 6 months" },
    "1_year": { optionName: "Past year" },
    "2_years": { optionName: "Past 2 years" },
    "3_years": { optionName: "Past 3 years" },
    all: { optionName: "All time" },
} as const;
export type FilterOption = keyof typeof filterOptions;

const ordersPerPage = 10;

export function OrderHistory() {
    const { headerInfo } = useContext(RootContext);
    const { forceClose } = headerInfo;

    const { orders, defaultData } = useContext(UserContext);
    const { setParams, attempt } = orders;

    let ordersData = { quantity: 0, orders: defaultData.orders as OrderData[] };

    const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [{ name: "orders", context: orders, markUnattemptedAsAwaiting: true }],
    });

    if (!contextAwaitingAny) {
        if (data.orders) ordersData = data.orders;
    }

    /**
     * Need to include this - the orders state is stored in the Root component's UserContext, and
     * its 'awaiting' field is initially set to false, meaning before the 'attempt' function is
     * called in the hook below, and subsequently the 'awaiting' field is set to true in
     * UserContext, the default orders data is shown briefly on the first couple of render cycles.
     * This check prevents that from happening.
     */
    const hasAttempted = useRef<boolean>(false);
    useEffect(() => {
        if (contextAwaitingAny) hasAttempted.current = true;
    }, [contextAwaitingAny]);

    const awaitingAny = contextAwaitingAny || !hasAttempted.current;

    const { quantity, orders: orderList } = ordersData;

    const [filter, setFilter] = useState<FilterOption>("1_month");
    const [page, setPage] = useState<number>(0);
    const [start, end] = useMemo(() => {
        return [page * ordersPerPage, page * ordersPerPage + ordersPerPage];
    }, [page]);

    useEffect(() => {
        setParams([{ params: { filter, start, end } }]);
        attempt();
    }, [setParams, attempt, filter, start, end]);

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

    return (orderList && orderList.length > 0) || awaitingAny ? (
        <div className={styles["order-history-container"]} ref={targetRef}>
            <Skeleton visible={awaitingAny}>
                <p
                    className={styles["order-count"]}
                    style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                >
                    {quantity} orders
                </p>
            </Skeleton>

            <Divider className={styles["divider"]} />

            <div className={styles["filter-container"]}>
                <label htmlFor="filter-orders" className={styles["label"]}>
                    Display orders placed within
                    <select
                        className={styles["select"]}
                        id="filter-orders"
                        name="filter-orders"
                        value={filter}
                        onChange={(e) => {
                            const { value } = e.target;
                            setFilter(value as FilterOption);
                            setPage(0);
                            setQueueScroll(true);
                        }}
                        disabled={awaitingAny}
                        key="sort-options"
                    >
                        {Object.entries(filterOptions).map((entry) => {
                            const [key, value] = entry;
                            const { optionName } = value;

                            return (
                                <option
                                    className={styles["filter-orders-option"]}
                                    value={key}
                                    key={`filter-orders-option-${key}`}
                                >
                                    {optionName}
                                </option>
                            );
                        })}
                    </select>
                </label>
            </div>

            <ul className={styles["order-history"]}>
                {orderList.slice(0, ordersPerPage).map((order) => {
                    const { id } = order;

                    return <OrderSummary data={order} awaiting={awaitingAny} key={id} />;
                })}
            </ul>

            <div className={styles["pagination-container"]}>
                <Pagination
                    total={Math.max(Math.ceil(quantity / ordersPerPage), 1)}
                    value={page + 1}
                    withEdges
                    onChange={
                        /**
                         * Can't reliably test this without mocking Pagination component due to
                         * 'ordersPerPage' possibly changing in future
                         */
                        /* v8 ignore start */

                        (newPageNo) => {
                            setPage(newPageNo - 1);
                            setQueueScroll(true);
                        }

                        /* v8 ignore stop */
                    }
                    disabled={awaitingAny}
                    classNames={{ control: styles["pagination-control"] }}
                />
            </div>
        </div>
    ) : (
        <p className={styles["no-order-history-message"]}>Nothing to show!</p>
    );
}

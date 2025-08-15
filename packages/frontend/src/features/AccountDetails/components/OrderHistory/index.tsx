import { useContext, useState, useEffect, useRef, useMemo } from "react";
import { RootContext, IUserContext, UserContext } from "@/pages/Root";
import { useScrollIntoView } from "@mantine/hooks";
import { Skeleton, Divider, Pagination } from "@mantine/core";
import { v4 as uuid } from "uuid";
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

    const { user, orders, defaultData } = useContext(UserContext);

    const { response: userResponse } = user;
    const { response: ordersResponse, setParams, attempt, awaiting } = orders;

    const { data: userData } = userResponse;
    const { data: ordersData } = ordersResponse;

    const { orders: orderIds = [] } = userData || {};

    const [filter, setFilter] = useState<FilterOption>("1_month");
    const [page, setPage] = useState<number>(0);
    const [start, end] = useMemo(() => {
        return [page * ordersPerPage, page * ordersPerPage + ordersPerPage];
    }, [page]);

    /**
     * Need to include this - the orders state is stored in the Root component's UserContext, and
     * its 'awaiting' field is initially set to false, meaning before the 'attempt' function is
     * called in the hook below, and subsequently the 'awaiting' field is set to true in
     * UserContext, the default orders data is shown briefly on the first couple of render cycles.
     * This check prevents that from happening.
     */
    const hasAttempted = useRef<boolean>(false);
    useEffect(() => {
        if (awaiting) hasAttempted.current = true;
    }, [awaiting]);

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

    const awaitingOverride = awaiting || !hasAttempted.current;

    const data = !awaitingOverride
        ? ordersData
        : (defaultData.orders as NonNullable<IUserContext["orders"]["response"]["data"]>);

    return (data && data.length > 0) || awaitingOverride ? (
        <div className={styles["order-history-container"]} ref={targetRef}>
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
                        disabled={awaitingOverride}
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
                {data &&
                    data.slice(0, ordersPerPage).map((order) => {
                        const { id } = order;

                        return <OrderSummary data={order} awaiting={awaitingOverride} key={id} />;
                    })}
            </ul>

            <Skeleton visible={awaitingOverride}>
                <div
                    className={styles["pagination-container"]}
                    style={{ visibility: awaitingOverride ? "hidden" : "initial" }}
                >
                    <Pagination
                        // Adding data-testid attribute to test onChange logic; Pagination component
                        // doesn't have an accessible role and the page buttons' text content
                        // (numbers) often conflict with the other elements' text content.
                        data-testid="pagination"
                        total={Math.ceil(orderIds.length / ordersPerPage)}
                        value={page + 1}
                        withEdges
                        onChange={(newPageNo) => {
                            setPage(newPageNo - 1);
                            setQueueScroll(true);
                        }}
                        disabled={awaitingOverride}
                        classNames={{ control: styles["pagination-control"] }}
                    />
                </div>
            </Skeleton>
        </div>
    ) : (
        <p className={styles["no-order-history-message"]}>Nothing to show!</p>
    );
}

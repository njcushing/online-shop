import { useContext, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { ProductContext } from "@/pages/Product";
import { Button } from "@mantine/core";
import { Bell } from "@phosphor-icons/react";
import styles from "./index.module.css";

export function WatchlistButton() {
    const { watchlist } = useContext(UserContext);
    const { product, variant } = useContext(ProductContext);

    const { data: watchlistData, awaiting: awaitingWatchlist } = watchlist;
    const { data: productData, awaiting: awaitingProduct } = product;

    const isDisabled = useMemo(() => {
        return awaitingWatchlist || !watchlistData || awaitingProduct || !productData || !variant;
    }, [awaitingWatchlist, watchlistData, awaitingProduct, productData, variant]);

    const isWatching = useMemo<boolean>(() => {
        if (isDisabled) return false;
        return (
            watchlistData!.findIndex((item) => {
                return item.productId === productData?.id && item.variantId === variant?.id;
            }) > -1
        );
    }, [isDisabled, watchlistData, productData, variant]);

    return (
        <div className={styles["watchlist-button-container"]}>
            <Button
                color="black"
                variant="outline"
                className={styles["watchlist-button"]}
                disabled={isDisabled}
                aria-label={isWatching ? "Remove from watchlist" : "Add to watchlist"}
            >
                <Bell size={24} weight="light" />
            </Button>
            {isWatching && (
                <span
                    className={`${styles["is-on-watchlist-icon"]} material-symbols-sharp`}
                    style={{ fontSize: "12px", fontWeight: "bold" }}
                >
                    Check
                </span>
            )}
        </div>
    );
}

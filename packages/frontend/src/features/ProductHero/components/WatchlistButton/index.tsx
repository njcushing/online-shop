import { useContext, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { ProductContext } from "@/pages/Product";
import { Button } from "@mantine/core";
import { Bell } from "@phosphor-icons/react";
import { ProductVariant } from "@/utils/products/product";
import { User } from "@/utils/schemas/user";
import styles from "./index.module.css";

const isVariantInWatchlist = (watchlist: User["watchlist"], variant: ProductVariant): boolean => {
    return !!watchlist.find((entry) => entry === variant.id);
};

export function WatchlistButton() {
    const { user } = useContext(UserContext);
    const { product, variant } = useContext(ProductContext);

    const { response: userResponse, awaiting: awaitingUser } = user;
    const { response: productResponse, awaiting: awaitingProduct } = product;

    const { data: userData } = userResponse;
    const { data: productData } = productResponse;

    const { watchlist } = userData || {};

    const isDisabled = useMemo(() => {
        return awaitingUser || !watchlist || awaitingProduct || !productData || !variant;
    }, [awaitingUser, watchlist, awaitingProduct, productData, variant]);

    const isWatching = useMemo<boolean>(() => {
        if (isDisabled || !watchlist || !variant) return false;
        return isVariantInWatchlist(watchlist, variant);
    }, [variant, watchlist, isDisabled]);

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

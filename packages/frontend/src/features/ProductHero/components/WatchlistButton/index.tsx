import { useContext, useMemo } from "react";
import { UserContext } from "@/pages/Root";
import { ProductContext } from "@/pages/Product";
import { Button } from "@mantine/core";
import { Bell, CheckFat } from "@phosphor-icons/react";
import { ProductVariant } from "@/utils/products/product";
import { User } from "@/utils/schemas/user";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import styles from "./index.module.css";

const isVariantInWatchlist = (watchlist: User["watchlist"], variant: ProductVariant): boolean => {
    return !!watchlist.find((entry) => entry === variant.id);
};

export function WatchlistButton() {
    const { user } = useContext(UserContext);
    const { product, variant } = useContext(ProductContext);

    let userData = null;
    let productData = null;
    let variantData = null;

    const { data, awaitingAny } = useQueryContexts({
        contexts: [
            { name: "user", context: user },
            { name: "product", context: product },
        ],
    });

    if (!awaitingAny) {
        if (data.user) userData = data.user;
        if (data.product) productData = data.product;
        if (variant) variantData = variant;
    }

    const { watchlist } = userData || {};

    const isDisabled = useMemo(() => {
        return awaitingAny || !watchlist || !productData || !variantData;
    }, [awaitingAny, watchlist, productData, variantData]);

    const isWatching = useMemo<boolean>(() => {
        if (isDisabled || !watchlist || !variantData) return false;
        return isVariantInWatchlist(watchlist, variantData);
    }, [variantData, watchlist, isDisabled]);

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
                    className={styles["is-on-watchlist-icon"]}
                    style={{ fontSize: "12px", fontWeight: "bold" }}
                >
                    <CheckFat size={8} weight="fill" />
                </span>
            )}
        </div>
    );
}

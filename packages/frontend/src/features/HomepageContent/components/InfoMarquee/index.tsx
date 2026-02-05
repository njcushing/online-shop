import { Fragment, useMemo } from "react";
import { useMatches } from "@mantine/core";
import {
    Heart,
    CoffeeBean,
    Truck,
    Empty,
    Recycle,
    Leaf,
    Star,
    IconProps,
} from "@phosphor-icons/react";
import { v4 as uuid } from "uuid";
import styles from "./index.module.css";

export function InfoMarquee() {
    const symbolProps = useMatches<IconProps>(
        {
            base: {
                color: "rgba(0, 0, 0, 0.8)",
                size: 20,
                weight: "fill",
            },
            xs: {
                color: "rgba(0, 0, 0, 0.8)",
                size: 22,
                weight: "fill",
            },
        },
        { getInitialValueInEffect: false },
    );

    const marqueeItemsInfo = useMemo(() => {
        return [
            { symbol: <Heart {...symbolProps} />, text: "Ethically-Sourced" },
            { symbol: <CoffeeBean {...symbolProps} />, text: "Roasted In-House" },
            { symbol: <Truck {...symbolProps} />, text: "Free Delivery Available" },
            { symbol: <Empty {...symbolProps} />, text: "Caffiene-Free" },
            { symbol: <Recycle {...symbolProps} />, text: "Recyclable Packaging" },
            { symbol: <Leaf {...symbolProps} />, text: "Biodegradable Pods" },
            { symbol: <Star {...symbolProps} />, text: "Speciality Blends" },
        ];
    }, [symbolProps]);

    const marqueeItems = useMemo(() => {
        return marqueeItemsInfo.map((marqueeItem) => {
            const { symbol, text } = marqueeItem;
            return (
                <span className={styles["marquee-item"]} key={text}>
                    {symbol}
                    {text}
                </span>
            );
        });
    }, [marqueeItemsInfo]);

    return (
        <section className={styles["info-marquee"]}>
            <div className={styles["marquee"]}>
                <div className={styles["marquee-inner"]}>
                    {Array.from({ length: 10 }).map(() => {
                        return <Fragment key={uuid()}>{marqueeItems}</Fragment>;
                    })}
                </div>
            </div>
        </section>
    );
}

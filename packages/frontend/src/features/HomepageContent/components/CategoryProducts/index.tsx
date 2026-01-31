import { useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { RootContext } from "@/pages/Root";
import { useMatches, Button } from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { buildCategoriesTree } from "@/utils/products/categories";
import styles from "./index.module.css";

const slideGapPx = 16;

export function CategoryProducts() {
    const { categories } = useContext(RootContext);

    const { data, awaitingAny } = useQueryContexts({
        contexts: [{ name: "categories", context: categories }],
    });

    const categoriesData = useMemo(() => {
        if (data.categories) return data.categories;
        return [];
    }, [data]);

    const categoryTree = useMemo<ReturnType<typeof buildCategoriesTree>>(() => {
        return buildCategoriesTree(categoriesData || []);
    }, [categoriesData]);

    const [displaySkeletons, setDisplaySkeletons] = useState(true);
    useEffect(() => setDisplaySkeletons(awaitingAny), [awaitingAny]);

    const emblaRef = useRef<Embla | null>(null);

    /*
     * I have to do this using useMatches instead of just setting slidesToScroll="auto" directly on
     * the component and breakpoints on the slideSize prop because the number of indicators doesn't
     * update when slideSize changes when a breakpoint is crossed.
     */

    const carouselProps = useMatches(
        {
            base: {
                slideSize: "100%",
                slidesToScroll: 1,
            },
            xs: {
                slideSize: `calc((100% / 2) - (${slideGapPx}px * (1 / 2)))`,
                slidesToScroll: 2,
            },
            md: {
                slideSize: `calc((100% / 3) - (${slideGapPx}px * (2 / 3)))`,
                slidesToScroll: 3,
            },
            lg: {
                slideSize: `calc((100% / 4) - (${slideGapPx}px * (3 / 4)))`,
                slidesToScroll: 4,
            },
        },
        { getInitialValueInEffect: false },
    );

    /**
     * Don't test logic dependent on window dimensions - window width is 0px in unit tests using
     * jsdom as an environment
     */
    /* v8 ignore start */

    const handleFocus = useCallback(
        (i: number) => {
            if (emblaRef.current) {
                emblaRef.current.scrollTo(Math.floor(i) / carouselProps.slidesToScroll);
            }
        },
        [carouselProps.slidesToScroll],
    );

    /* v8 ignore stop */

    const carouselSlidesMemo = useMemo(() => {
        return categoryTree
            .flatMap((c) => (c.slug === "coffee" ? c.subcategories : []))
            .slice(0, awaitingAny ? carouselProps.slidesToScroll : undefined)
            .map((c, i) => {
                return (
                    <Carousel.Slide
                        data-last={i === 4}
                        onFocus={
                            /* v8 ignore start */

                            () => handleFocus(i)

                            /* v8 ignore stop */
                        }
                        className={styles["Carousel-slide"]}
                        key={c.slug}
                    >
                        <p>{c.slug}</p>
                    </Carousel.Slide>
                );
            });
    }, [carouselProps.slidesToScroll, handleFocus, categoryTree, awaitingAny]);

    const carouselMemo = useMemo(() => {
        return (
            <Carousel
                slideSize={carouselProps.slideSize}
                slidesToScroll={carouselProps.slidesToScroll}
                slideGap={`${slideGapPx}px`}
                align="start"
                includeGapInSize={false}
                skipSnaps
                previousControlIcon={<ArrowLeft />}
                nextControlIcon={<ArrowRight />}
                withControls={false}
                withIndicators
                getEmblaApi={(api) => {
                    emblaRef.current = api;
                }}
                classNames={{
                    root: styles["Carousel-root"],
                    container: styles["Carousel-container"],
                    viewport: styles["Carousel-viewport"],
                    indicator: styles["Carousel-indicator"],
                    indicators: styles["Carousel-indicators"],
                }}
            >
                {carouselSlidesMemo}
            </Carousel>
        );
    }, [carouselProps.slideSize, carouselProps.slidesToScroll, carouselSlidesMemo]);

    if (!awaitingAny && categoriesData.length === 0) return null;

    return (
        <section className={styles["category-products"]}>
            <div className={styles["category-products-width-controller"]}>
                <div className={styles["top-row-container"]}>
                    <div className={styles["title-container"]}>
                        <h2 className={styles["category-products-title"]}>
                            Shop our range of delicious coffees
                        </h2>
                        <p className={styles["category-products-subcopy"]}>
                            Great flavours. Great prices. Roasted right here in-house.
                        </p>
                    </div>

                    <Button
                        color="#242424"
                        className={styles["shop-now-button"]}
                        disabled={displaySkeletons}
                    >
                        Shop Now
                    </Button>
                </div>

                {carouselMemo}
            </div>
        </section>
    );
}

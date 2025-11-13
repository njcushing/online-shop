import { useCallback, useRef } from "react";
import { useMatches } from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import { mockProducts } from "@/utils/products/product";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { ProductCard } from "../ProductCard";
import styles from "./index.module.css";

const slideGapPx = 16;

export function RecommendedProducts() {
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

    return (
        <section className={styles["recommended-products"]}>
            <div className={styles["recommended-products-width-controller"]}>
                <h2 className={styles["recommended-products-title"]}>You may also like these</h2>
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
                        root: styles["carousel-root"],
                        container: styles["carousel-container"],
                        viewport: styles["carousel-viewport"],
                        indicator: styles["carousel-indicator"],
                        indicators: styles["carousel-indicators"],
                    }}
                >
                    {mockProducts.slice(5).map((product, i) => {
                        return (
                            <Carousel.Slide
                                data-last={i === 4}
                                onFocus={
                                    /* v8 ignore start */

                                    () => handleFocus(i)

                                    /* v8 ignore stop */
                                }
                                className={styles["carousel-slide"]}
                                key={product.id}
                                style={{ marginRight: i === 4 ? "0px" : `${slideGapPx}px` }}
                            >
                                <ProductCard productData={product} />
                            </Carousel.Slide>
                        );
                    })}
                </Carousel>
            </div>
        </section>
    );
}

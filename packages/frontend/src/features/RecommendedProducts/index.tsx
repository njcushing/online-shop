import { useMatches } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { products } from "@/utils/products/product";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { ProductCard } from "../ProductCard";
import styles from "./index.module.css";

const slideGapPx = 16;

export function RecommendedProducts() {
    /*
     * I have to do this using useMatches instead of just setting slidesToScroll="auto" directly on
     * the component and breakpoints on the slideSize prop because the number of indicators doesn't
     * update when slideSize changes when a breakpoint is crossed.
     */

    const carouselProps = useMatches({
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
    });

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
                    classNames={{
                        root: styles["carousel-root"],
                        container: styles["carousel-container"],
                        indicator: styles["carousel-indicator"],
                        indicators: styles["carousel-indicators"],
                    }}
                >
                    {products.map((product, i) => {
                        return (
                            <Carousel.Slide
                                data-last={i === products.length - 1}
                                className={styles["carousel-slide"]}
                                key={product.id}
                                style={{
                                    marginRight:
                                        i === products.length - 1 ? "0px" : `${slideGapPx}px`,
                                }}
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

/*

            <Carousel
                getEmblaApi={setSmallEmbla}
                slideSize={{
                    base: `calc((100% / 3) - (${slideGapPx}px * (2 / 3)))`,
                    md: `calc((100% / 4) - (${slideGapPx}px * (3 / 4)))`,
                }}
                slideGap={`${slideGapPx}px`}
                includeGapInSize={false}
                draggable={false}
                containScroll="keepSnaps"
                skipSnaps
                previousControlIcon={<ArrowLeft />}
                nextControlIcon={<ArrowRight />}
                onSlideChange={(slideIndex) => setCurrentSlide(slideIndex)}
                classNames={{
                    root: styles["carousel-small-root"],
                    viewport: styles["carousel-small-viewport"],
                    control: styles["carousel-small-control"],
                    controls: styles["carousel-small-controls"],
                }}
            >
                {images.map((url, i) => {
                    return (
                        <Carousel.Slide
                            onClick={() => setCurrentSlide(i)}
                            data-last={i === images.length - 1}
                            className={styles["carousel-slide"]}
                            key={url}
                            style={{
                                marginRight: i === images.length - 1 ? "0px" : `${slideGapPx}px`,
                            }}
                        >
                            <Image
                                src={url}
                                data-selected={currentSlide === i}
                                className={styles["carousel-image-small"]}
                            />
                        </Carousel.Slide>
                    );
                })}
            </Carousel>
*/

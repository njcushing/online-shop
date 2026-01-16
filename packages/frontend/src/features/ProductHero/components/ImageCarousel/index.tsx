import { useState, useEffect } from "react";
import { Carousel, Embla } from "@mantine/carousel";
import { Skeleton, Image } from "@mantine/core";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { GenericImage } from "@/utils/types";
import styles from "./index.module.css";

export type TImageCarousel = {
    images: GenericImage[];
    awaiting?: boolean;
};

const slideGapPx = 8;

export function ImageCarousel({ images, awaiting = false }: TImageCarousel) {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [mainEmbla, setMainEmbla] = useState<Embla | null>(null);
    const [smallEmbla, setSmallEmbla] = useState<Embla | null>(null);

    useEffect(() => {
        if (mainEmbla) mainEmbla.scrollTo(currentSlide);
        if (smallEmbla) smallEmbla.scrollTo(currentSlide);
    }, [currentSlide, mainEmbla, smallEmbla]);

    const usedImages = images.length > 0 ? images : [{ src: "", alt: "" }];

    return (
        <div className={styles["image-Carousel"]}>
            <Skeleton visible={awaiting}>
                <Carousel
                    getEmblaApi={setMainEmbla}
                    skipSnaps
                    onSlideChange={(slideIndex) => setCurrentSlide(slideIndex)}
                    withControls={false}
                    classNames={{
                        root: styles["Carousel-large-root"],
                    }}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                >
                    {usedImages.map((image) => {
                        const { src, alt } = image;
                        return (
                            <Carousel.Slide className={styles["Carousel-slide"]} key={src}>
                                <Image
                                    src={src}
                                    alt={alt}
                                    className={styles["Carousel-image-main"]}
                                />
                            </Carousel.Slide>
                        );
                    })}
                </Carousel>
            </Skeleton>

            <div className={styles["Carousel-small-container"]}>
                <Skeleton visible={awaiting} className={styles["Carousel-small-control-skeleton"]}>
                    <button
                        type="button"
                        aria-label="Previous image"
                        onClick={() => setCurrentSlide((curr) => curr - 1)}
                        disabled={currentSlide === 0}
                        className={styles["Carousel-small-control"]}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >
                        <ArrowLeft />
                    </button>
                </Skeleton>
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
                    withControls={false}
                    withIndicators
                    withKeyboardEvents={false}
                    onSlideChange={
                        // Unreachable without mocking Carousel component
                        /* c8 ignore next */
                        (slideIndex) => setCurrentSlide(slideIndex)
                    }
                    classNames={{
                        root: styles["Carousel-small-root"],
                        viewport: styles["Carousel-small-viewport"],
                        indicators: styles["Carousel-small-indicators"],
                        indicator: styles["Carousel-small-indicator"],
                    }}
                >
                    {usedImages.map((image, i) => {
                        const { src, alt } = image;
                        return (
                            <Carousel.Slide
                                role="button"
                                aria-label={`View image ${i + 1} of ${usedImages.length}`}
                                tabIndex={currentSlide === i ? -1 : 0}
                                onClick={() => setCurrentSlide(i)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        setCurrentSlide(i);
                                    }
                                }}
                                data-selected={currentSlide === i}
                                data-last={i === usedImages.length - 1}
                                className={styles["Carousel-slide"]}
                                key={`image-Carousel-slide-${src}`}
                                style={{
                                    marginRight:
                                        i === usedImages.length - 1 ? "0px" : `${slideGapPx}px`,
                                }}
                            >
                                <Skeleton
                                    visible={awaiting}
                                    key={`image-Carousel-slide-${src}-skeleton`}
                                >
                                    <Image
                                        src={src}
                                        alt={alt}
                                        className={styles["Carousel-image-small"]}
                                        style={{
                                            visibility: awaiting ? "hidden" : "initial",
                                        }}
                                    />
                                </Skeleton>
                            </Carousel.Slide>
                        );
                    })}
                </Carousel>
                <Skeleton visible={awaiting} className={styles["Carousel-small-control-skeleton"]}>
                    <button
                        type="button"
                        aria-label="Next image"
                        onClick={() => setCurrentSlide((curr) => curr + 1)}
                        disabled={currentSlide === usedImages.length - 1}
                        className={styles["Carousel-small-control"]}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >
                        <ArrowRight />
                    </button>
                </Skeleton>
            </div>
        </div>
    );
}

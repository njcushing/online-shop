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

const SkeletonClassNames = {
    root: styles["skeleton-root"],
};

export function ImageCarousel({ images, awaiting = false }: TImageCarousel) {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [mainEmbla, setMainEmbla] = useState<Embla | null>(null);
    const [smallEmbla, setSmallEmbla] = useState<Embla | null>(null);

    useEffect(() => {
        if (mainEmbla) mainEmbla.scrollTo(currentSlide);
        if (smallEmbla) smallEmbla.scrollTo(currentSlide);
    }, [currentSlide, mainEmbla, smallEmbla]);

    return (
        <div className={styles["image-carousel"]}>
            <Skeleton visible={awaiting} classNames={SkeletonClassNames}>
                <Carousel
                    getEmblaApi={setMainEmbla}
                    skipSnaps
                    onSlideChange={(slideIndex) => setCurrentSlide(slideIndex)}
                    withControls={false}
                    classNames={{
                        root: styles["carousel-large-root"],
                    }}
                    style={{ visibility: awaiting ? "hidden" : "initial" }}
                >
                    {images.map((image) => {
                        const { src, alt } = image;
                        return (
                            <Carousel.Slide className={styles["carousel-slide"]} key={src}>
                                <Image
                                    src={src}
                                    alt={alt}
                                    className={styles["carousel-image-main"]}
                                />
                            </Carousel.Slide>
                        );
                    })}
                </Carousel>
            </Skeleton>

            <div className={styles["carousel-small-container"]}>
                <Skeleton
                    visible={awaiting}
                    className={styles["carousel-small-control-skeleton"]}
                    classNames={SkeletonClassNames}
                >
                    <button
                        type="button"
                        aria-label="Previous image"
                        onClick={() => setCurrentSlide((curr) => curr - 1)}
                        disabled={currentSlide === 0}
                        className={styles["carousel-small-control"]}
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
                    onSlideChange={(slideIndex) => setCurrentSlide(slideIndex)}
                    classNames={{
                        root: styles["carousel-small-root"],
                        viewport: styles["carousel-small-viewport"],
                    }}
                >
                    {images.map((image, i) => {
                        const { src, alt } = image;
                        return (
                            <Carousel.Slide
                                onClick={() => setCurrentSlide(i)}
                                data-last={i === images.length - 1}
                                className={styles["carousel-slide"]}
                                key={`image-carousel-slide-${src}`}
                                style={{
                                    marginRight:
                                        i === images.length - 1 ? "0px" : `${slideGapPx}px`,
                                }}
                            >
                                <Skeleton
                                    visible={awaiting}
                                    classNames={SkeletonClassNames}
                                    key={`image-carousel-slide-${src}-skeleton`}
                                >
                                    <Image
                                        src={src}
                                        alt={alt}
                                        data-selected={currentSlide === i}
                                        className={styles["carousel-image-small"]}
                                        style={{
                                            visibility: awaiting ? "hidden" : "initial",
                                        }}
                                    />
                                </Skeleton>
                            </Carousel.Slide>
                        );
                    })}
                </Carousel>
                <Skeleton
                    visible={awaiting}
                    className={styles["carousel-small-control-skeleton"]}
                    classNames={SkeletonClassNames}
                >
                    <button
                        type="button"
                        aria-label="Next image"
                        onClick={() => setCurrentSlide((curr) => curr + 1)}
                        disabled={currentSlide === images.length - 1}
                        className={styles["carousel-small-control"]}
                        style={{ visibility: awaiting ? "hidden" : "initial" }}
                    >
                        <ArrowRight />
                    </button>
                </Skeleton>
            </div>

            <span className={styles["current-image-number"]}>
                {currentSlide + 1} / {images.length}
            </span>
        </div>
    );
}

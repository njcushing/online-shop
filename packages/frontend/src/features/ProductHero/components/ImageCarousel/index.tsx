import { useState, useEffect } from "react";
import { Carousel, Embla } from "@mantine/carousel";
import { Image } from "@mantine/core";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import styles from "./index.module.css";

export type TImageCarousel = {
    images: string[];
};

const slideGapPx = 8;

export function ImageCarousel({ images }: TImageCarousel) {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [mainEmbla, setMainEmbla] = useState<Embla | null>(null);
    const [smallEmbla, setSmallEmbla] = useState<Embla | null>(null);

    useEffect(() => {
        if (mainEmbla) mainEmbla.scrollTo(currentSlide);
        if (smallEmbla) smallEmbla.scrollTo(currentSlide);
    }, [currentSlide, mainEmbla, smallEmbla]);

    return (
        <div className={styles["image-carousel"]}>
            <Carousel
                getEmblaApi={setMainEmbla}
                skipSnaps
                onSlideChange={(slideIndex) => setCurrentSlide(slideIndex)}
                withControls={false}
                classNames={{
                    root: styles["carousel-large"],
                }}
            >
                {images.map((url) => {
                    return (
                        <Carousel.Slide className={styles["carousel-slide"]} key={url}>
                            <Image src={url} className={styles["carousel-image-main"]} />
                        </Carousel.Slide>
                    );
                })}
            </Carousel>

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
                    root: styles["carousel-small"],
                    control: styles["carousel-control"],
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

            <span className={styles["current-image-number"]}>
                {currentSlide + 1} / {images.length}
            </span>
        </div>
    );
}

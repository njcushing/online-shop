import { useContext, useState, useEffect } from "react";
import { ProductContext } from "@/pages/Product";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { Embla, Carousel } from "@mantine/carousel";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Panel } from "./components/Panel";
import { blendData } from "./blendData";
import styles from "./index.module.css";

export function CoffeeBlendInfoPanels() {
    const { product } = useContext(ProductContext);

    const { awaitingAny } = useQueryContexts({
        contexts: [{ name: "product", context: product }],
    });

    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [embla, setEmbla] = useState<Embla | null>(null);

    useEffect(() => {
        if (embla) embla.scrollTo(currentSlide);
    }, [currentSlide, embla]);

    return (
        <section className={styles["coffee-blend-info-panels"]}>
            <div className={styles["coffee-blend-info-panels-width-controller"]}>
                <div className={styles["intro"]}>
                    <p className={styles["intro-title"]}>Our Blends</p>
                    <p className={styles["intro-description"]}>
                        Explore our range of coffee blends, from bright and light roasts to deep,
                        bold, and flavoured favourites; crafted to suit every taste and brewing
                        style. Our blends are available whole bean, ground or instant, or in pods
                        compatible with our espresso coffee machines.
                    </p>
                </div>

                <div className={styles["Carousel-wrapper"]}>
                    <button
                        type="button"
                        aria-label="Previous blend"
                        onClick={() => setCurrentSlide((curr) => curr - 1)}
                        disabled={currentSlide === 0}
                        className={styles["Carousel-control-left"]}
                        style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                    >
                        <ArrowLeft weight="bold" />
                    </button>

                    <Carousel
                        getEmblaApi={setEmbla}
                        slideGap={32}
                        skipSnaps
                        onSlideChange={(slideIndex) => setCurrentSlide(slideIndex)}
                        withControls={false}
                        withIndicators
                        classNames={{
                            root: styles["Carousel-root"],
                            viewport: styles["Carousel-viewport"],
                            indicators: styles["Carousel-indicators"],
                            indicator: styles["Carousel-indicator"],
                        }}
                        style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                    >
                        {blendData.map((blend, i) => {
                            const { code } = blend;

                            return (
                                <Carousel.Slide
                                    className={styles["Carousel-slide"]}
                                    data-selected={i === currentSlide}
                                    key={code}
                                >
                                    <Panel data={blend} />
                                </Carousel.Slide>
                            );
                        })}
                    </Carousel>

                    <button
                        type="button"
                        aria-label="Next blend"
                        onClick={() => setCurrentSlide((curr) => curr + 1)}
                        disabled={currentSlide === blendData.length - 1}
                        className={styles["Carousel-control-right"]}
                        style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                    >
                        <ArrowRight weight="bold" />
                    </button>
                </div>
            </div>
        </section>
    );
}

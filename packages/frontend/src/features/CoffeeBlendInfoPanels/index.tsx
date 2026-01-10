import { useContext, useState, useEffect } from "react";
import { ProductContext } from "@/pages/Product";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { Embla, Carousel } from "@mantine/carousel";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { Panel } from "./components/Panel";
import styles from "./index.module.css";

export type BlendData = {
    code: string;
    name: string;
};

const blends: BlendData[] = [
    { code: "HO", name: "House" },
    { code: "LT", name: "Light" },
    { code: "MD", name: "Medium" },
    { code: "DK", name: "Dark" },
    { code: "XD", name: "Extra Dark" },
    { code: "BK", name: "Breakfast" },
    { code: "PK", name: "Pumpkin Spice" },
    { code: "MO", name: "Mocha" },
    { code: "ES", name: "Espresso" },
    { code: "VA", name: "Vanilla" },
    { code: "CA", name: "Caramel" },
    { code: "IN", name: "Intense" },
    { code: "FR", name: "French Roast" },
    { code: "IR", name: "Italian Roast" },
];

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
                        classNames={{
                            root: styles["Carousel-root"],
                            viewport: styles["Carousel-viewport"],
                        }}
                        style={{ visibility: awaitingAny ? "hidden" : "initial" }}
                    >
                        {blends.map((blend, i) => {
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
                        disabled={currentSlide === blends.length - 1}
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

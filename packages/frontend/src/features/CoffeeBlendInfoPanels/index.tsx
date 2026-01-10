import { useContext, useState } from "react";
import { ProductContext } from "@/pages/Product";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { Carousel } from "@mantine/carousel";
import { Panel } from "./components/Panel";
import styles from "./index.module.css";

const blends = ["HO", "LT", "MD", "DK", "XD"];

export function CoffeeBlendInfoPanels() {
    const { product } = useContext(ProductContext);

    const { awaitingAny } = useQueryContexts({
        contexts: [{ name: "product", context: product }],
    });

    const [currentSlide, setCurrentSlide] = useState<number>(0);

    return (
        <section className={styles["coffee-blend-info-panels"]}>
            <div className={styles["coffee-blend-info-panels-width-controller"]}>
                <Carousel
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
                        return (
                            <Carousel.Slide
                                className={styles["Carousel-slide"]}
                                data-selected={i === currentSlide}
                                key={blend}
                            >
                                <Panel blendName={blend} />
                            </Carousel.Slide>
                        );
                    })}
                </Carousel>
            </div>
        </section>
    );
}

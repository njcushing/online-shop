import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import styles from "./index.module.css";

const colours = ["red", "yellow", "green", "blue", "purple"];

export function PromotionBanner() {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const carouselRef = useRef<HTMLDivElement | null>(null);

    const carouselSlidesMemo = useMemo(() => {
        return colours.map((c, i) => {
            return (
                <div className={styles["carousel-slide"]} key={c}>
                    <div className={styles["slide-inner"]} style={{ backgroundColor: c }}>
                        <p className={styles["slide-title"]}>Test Panel {i + 1}</p>
                    </div>
                </div>
            );
        });
    }, []);

    useEffect(() => {
        const { current } = carouselRef;

        if (current) {
            current.style.transform = `translateX(-${100 * currentSlide}%)`;
        }
    }, [currentSlide, carouselSlidesMemo]);

    return (
        <section className={styles["promotion-banner"]}>
            <button
                type="button"
                aria-label="Previous blend"
                onClick={() => setCurrentSlide((curr) => curr - 1)}
                disabled={currentSlide === 0}
                className={styles["carousel-control-left"]}
            >
                <ArrowLeft weight="bold" />
            </button>

            <div className={styles["carousel"]}>
                <div className={styles["carousel-inner"]} ref={carouselRef}>
                    {carouselSlidesMemo}
                </div>
            </div>

            <button
                type="button"
                aria-label="Next blend"
                onClick={() => setCurrentSlide((curr) => curr + 1)}
                disabled={currentSlide === carouselSlidesMemo.length - 1}
                className={styles["carousel-control-right"]}
            >
                <ArrowRight weight="bold" />
            </button>
        </section>
    );
}

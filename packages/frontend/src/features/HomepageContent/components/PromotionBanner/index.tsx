import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { PromotionPanel1 } from "./components/PromotionPanel1";
import { PromotionPanel2 } from "./components/PromotionPanel2";
import { PromotionPanel3 } from "./components/PromotionPanel3";
import styles from "./index.module.css";

export function PromotionBanner() {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const carouselRef = useRef<HTMLDivElement | null>(null);

    const carouselSlidesMemo = useMemo(() => {
        return [
            <PromotionPanel1 key="promotion-panel-1" />,
            <PromotionPanel2 key="promotion-panel-2" />,
            <PromotionPanel3 key="promotion-panel-3" />,
        ];
    }, []);

    useEffect(() => {
        const { current } = carouselRef;

        if (current) {
            current.style.transform = `translateX(-${100 * currentSlide}%)`;
        }
    }, [currentSlide, carouselSlidesMemo]);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const scrollToNext = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        setCurrentSlide((curr) => (curr + 1) % carouselSlidesMemo.length);

        timerRef.current = setTimeout(() => {
            scrollToNext();
        }, 8000);
    }, [carouselSlidesMemo]);

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        scrollToNext();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [scrollToNext]);

    if (carouselSlidesMemo.length === 0) return null;

    return (
        <section className={styles["promotion-banner"]}>
            {carouselSlidesMemo.length > 1 && (
                <button
                    type="button"
                    aria-label="Previous blend"
                    onClick={() => {
                        setCurrentSlide((curr) => curr - 1);

                        if (timerRef.current) {
                            clearTimeout(timerRef.current);
                            timerRef.current = null;
                        }

                        timerRef.current = setTimeout(() => {
                            scrollToNext();
                        }, 8000);
                    }}
                    disabled={currentSlide === 0}
                    className={styles["carousel-control-left"]}
                >
                    <ArrowLeft weight="bold" />
                </button>
            )}

            {carouselSlidesMemo.length > 1 && (
                <button
                    type="button"
                    aria-label="Next blend"
                    onClick={() => {
                        setCurrentSlide((curr) => curr + 1);

                        if (timerRef.current) {
                            clearTimeout(timerRef.current);
                            timerRef.current = null;
                        }

                        timerRef.current = setTimeout(() => {
                            scrollToNext();
                        }, 8000);
                    }}
                    disabled={currentSlide === carouselSlidesMemo.length - 1}
                    className={styles["carousel-control-right"]}
                >
                    <ArrowRight weight="bold" />
                </button>
            )}

            <div className={styles["carousel"]}>
                <div className={styles["carousel-inner"]} ref={carouselRef}>
                    {carouselSlidesMemo}
                </div>
            </div>
        </section>
    );
}

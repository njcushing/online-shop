import { useContext, useEffect, useCallback, useRef, useMemo } from "react";
import { ProductContext } from "@/pages/Product";
import { useMatches } from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import * as useAsync from "@/hooks/useAsync";
import { useQueryContexts } from "@/hooks/useQueryContexts";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/products/[slug]/GET";
import {
    ResponseBody as GetRelatedProductsBySlugResponseDto,
    getRelatedProductsBySlug,
} from "@/api/products/[slug]/related/GET";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { mockProducts } from "@/utils/products/product";
import { customStatusCodes } from "@/api/types";
import { ProductCard } from "../ProductCard";
import styles from "./index.module.css";

const slideGapPx = 16;

export function RecommendedProducts() {
    const { product, defaultData } = useContext(ProductContext);

    const { data, awaitingAny: contextAwaitingAny } = useQueryContexts({
        contexts: [{ name: "product", context: product }],
    });

    const productData = useMemo(() => {
        if (!contextAwaitingAny && data.product) return data.product;
        return defaultData.product as GetProductBySlugResponseDto;
    }, [defaultData.product, data.product, contextAwaitingAny]);

    const { response, setParams, attempt, awaiting } = useAsync.GET(
        getRelatedProductsBySlug,
        [{}] as Parameters<typeof getRelatedProductsBySlug>,
        { attemptOnMount: false },
    );
    useEffect(() => {
        if (contextAwaitingAny) return;
        if (productData.slug.length > 0) {
            setParams([{ params: { path: { slug: productData.slug } } }]);
            attempt();
        }
    }, [productData.slug, contextAwaitingAny, setParams, attempt]);

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

    const relatedProducts = useMemo(() => {
        if (!awaiting && response.success) return response.data;
        return mockProducts as unknown as GetRelatedProductsBySlugResponseDto;
    }, [response, awaiting]);

    const awaitingAny =
        awaiting || contextAwaitingAny || response.status === customStatusCodes.unattempted;

    const carouselSlidesMemo = useMemo(() => {
        return relatedProducts
            .slice(0, awaitingAny ? carouselProps.slidesToScroll : undefined)
            .map((relatedProduct, i) => {
                return (
                    <Carousel.Slide
                        data-last={i === 4}
                        onFocus={
                            /* v8 ignore start */

                            () => handleFocus(i)

                            /* v8 ignore stop */
                        }
                        className={styles["carousel-slide"]}
                        key={relatedProduct.id}
                    >
                        <ProductCard productData={relatedProduct} awaiting={awaitingAny} />
                    </Carousel.Slide>
                );
            });
    }, [carouselProps.slidesToScroll, handleFocus, relatedProducts, awaitingAny]);

    const carouselMemo = useMemo(() => {
        return (
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
                {carouselSlidesMemo}
            </Carousel>
        );
    }, [carouselProps.slideSize, carouselProps.slidesToScroll, carouselSlidesMemo]);

    if (!awaitingAny && relatedProducts.length === 0) return null;

    return (
        <section className={styles["recommended-products"]}>
            <div className={styles["recommended-products-width-controller"]}>
                <h2 className={styles["recommended-products-title"]}>You may also like these</h2>

                {carouselMemo}
            </div>
        </section>
    );
}

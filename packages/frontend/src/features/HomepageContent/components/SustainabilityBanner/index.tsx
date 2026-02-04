import { useState } from "react";
import { useMatches, Button, Collapse, Image } from "@mantine/core";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import styles from "./index.module.css";

export function SustainabilityBanner() {
    const layout = useMatches<string>(
        { base: "thin", sm: "wide" },
        { getInitialValueInEffect: false },
    );

    const [open, setOpen] = useState<boolean>(false);

    return (
        <section className={styles["sustainability-banner"]}>
            <h2 className={styles["sustainability-heading"]}>
                We take sustainability <strong>seriously</strong>.
            </h2>

            <p className={styles["sustainability-opening-text"]}>
                {`At Cafree, we want to bring you the best flavours the world has to offer. We
                    also believe it's our responsibility to maintain a sustainable approach to the
                    farming, packaging and transportation of our goods, so that you know every
                    cup you make is created with both love and respect for our world and its
                    inhabitants.`}
            </p>

            <Collapse in={open} className={styles["Collapse"]}>
                <div className={styles["Collapse-vertical-padding"]}></div>

                <div className={styles["sustainability-main-sections"]} data-layout={layout}>
                    <div className={styles["sustainability-main-section-container"]}>
                        <div className={styles["sustainability-main-section-container-inner"]}>
                            <h3 className={styles["sustainability-main-section-heading"]}>
                                Farming
                            </h3>

                            <div className={styles["sustainability-main-section-content"]}>
                                <p className={styles["sustainability-main-section-body-text"]}>
                                    We work with small, family-owned farms around the world in
                                    countries spanning the globe, from South America, to Africa, to
                                    Asia. Our dedicated farmers all have one thing in common: they
                                    share our vision about sustainable farming.
                                </p>

                                <p className={styles["sustainability-main-section-body-text"]}>
                                    They achieve this through regenerative agricultural practises
                                    such as the preservation and enhancement of biodiversity, water
                                    conservation techniques and organic soil management. In turn,
                                    these practises benefit the farms by reducing reliance on
                                    artificial fertilisers and improving soil quality, increasing
                                    the longevity of the farms and the flavour of your coffee and
                                    tea.
                                </p>

                                <p className={styles["sustainability-main-section-body-text"]}>
                                    Our coffee and tea {`isn't`} always certified organic as it can
                                    be costly to register for the certification - something the
                                    small farms we work with often cannot afford. Be reassured that
                                    all of the farms we work with are run by knowledgeable,
                                    passionate people who know what {`they're`} doing and care
                                    deeply about their products.
                                </p>
                            </div>

                            {layout === "wide" && (
                                <Image
                                    radius="md"
                                    className={styles["sustainability-main-section-image"]}
                                />
                            )}
                        </div>
                    </div>

                    <div className={styles["sustainability-main-section-container"]}>
                        <div className={styles["sustainability-main-section-container-inner"]}>
                            <h3 className={styles["sustainability-main-section-heading"]}>
                                Trading
                            </h3>

                            <div className={styles["sustainability-main-section-content"]}>
                                <p className={styles["sustainability-main-section-body-text"]}>
                                    Placeholder
                                </p>
                            </div>

                            {layout === "wide" && (
                                <Image
                                    radius="md"
                                    className={styles["sustainability-main-section-image"]}
                                />
                            )}
                        </div>
                    </div>

                    <div className={styles["sustainability-main-section-container"]}>
                        <div className={styles["sustainability-main-section-container-inner"]}>
                            <h3 className={styles["sustainability-main-section-heading"]}>
                                Recyclable Packaging
                            </h3>

                            <div className={styles["sustainability-main-section-content"]}>
                                <p className={styles["sustainability-main-section-body-text"]}>
                                    Placeholder
                                </p>
                            </div>

                            {layout === "wide" && (
                                <Image
                                    radius="md"
                                    className={styles["sustainability-main-section-image"]}
                                />
                            )}
                        </div>
                    </div>

                    <div className={styles["sustainability-main-section-container"]}>
                        <div className={styles["sustainability-main-section-container-inner"]}>
                            <h3 className={styles["sustainability-main-section-heading"]}>
                                Compostable Pods
                            </h3>

                            <div className={styles["sustainability-main-section-content"]}>
                                <p className={styles["sustainability-main-section-body-text"]}>
                                    Placeholder
                                </p>
                            </div>

                            {layout === "wide" && (
                                <Image
                                    radius="md"
                                    className={styles["sustainability-main-section-image"]}
                                />
                            )}
                        </div>
                    </div>

                    <div className={styles["sustainability-main-section-container"]}>
                        <div className={styles["sustainability-main-section-container-inner"]}>
                            <h3 className={styles["sustainability-main-section-heading"]}>
                                Our Team
                            </h3>

                            <div className={styles["sustainability-main-section-content"]}>
                                <p className={styles["sustainability-main-section-body-text"]}>
                                    Placeholder
                                </p>
                            </div>

                            {layout === "wide" && (
                                <Image
                                    radius="md"
                                    className={styles["sustainability-main-section-image"]}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles["Collapse-vertical-padding"]}></div>
            </Collapse>

            <div className={styles["Button-container"]}>
                <Button
                    onClick={() => setOpen((c) => !c)}
                    color="transparent"
                    variant="filled"
                    classNames={{ root: styles["Button-root"], label: styles["Button-label"] }}
                >
                    {open ? (
                        <>
                            <CaretUp color="black" size={20} weight="regular" />
                            Show less
                        </>
                    ) : (
                        <>
                            Find out more
                            <CaretDown color="black" size={20} weight="regular" />
                        </>
                    )}
                </Button>
            </div>
        </section>
    );
}

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

                            <p className={styles["sustainability-main-section-body-text"]}>
                                Placeholder
                            </p>

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

                            <p className={styles["sustainability-main-section-body-text"]}>
                                Placeholder
                            </p>

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

                            <p className={styles["sustainability-main-section-body-text"]}>
                                Placeholder
                            </p>

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

                            <p className={styles["sustainability-main-section-body-text"]}>
                                Placeholder
                            </p>

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

                            <p className={styles["sustainability-main-section-body-text"]}>
                                Placeholder
                            </p>

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

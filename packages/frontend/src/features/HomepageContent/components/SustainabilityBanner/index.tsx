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

            <Collapse in={open} transitionDuration={800} className={styles["Collapse"]}>
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
                                    As a small business ourselves, when we were deciding which farms
                                    to work with, we decided it was imperative to support other
                                    small businesses around the world, and only ones who shared our
                                    principles regarding sustainability.
                                </p>

                                <p className={styles["sustainability-main-section-body-text"]}>
                                    We work directly with all our farmers in order to maintain
                                    brilliant, collaborative relationships. Our producers {`don't`}{" "}
                                    have Fair Trade certifications due to the very rigid
                                    requirements, the cost of obtaining the certification, and the
                                    lowering of earning potential (as prices are set by a third
                                    party), all of which incentivises growers to generate
                                    poorer-quality produce in greater yields in order to offset the
                                    cost.
                                </p>

                                <p className={styles["sustainability-main-section-body-text"]}>
                                    For us, working with the farmers directly makes much more sense.
                                    We do, and always will, pay our farmers far above the {`'`}Fair
                                    Trade{`'`} price, and in return they grow some of the greatest
                                    produce in the world.
                                </p>

                                <p className={styles["sustainability-main-section-body-text"]}>
                                    We also ensure all our business operations are carbon negative,
                                    all the way from crop to cup, including on our farms around the
                                    world, the transportation required to import the beans here in
                                    the UK, and at our main offices and warehouses - something{" "}
                                    {`we're`} very proud of.
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
                                    We could preach all day about how much we care about the
                                    environment, but it would be meaningless if that philosophy{" "}
                                    {`wasn't`} reflected in our products. To the best of our
                                    ability, we aim to utilise packaging that can be disposed of in
                                    a way that {`isn't`} harmful to the environment.
                                </p>

                                <p className={styles["sustainability-main-section-body-text"]}>
                                    The packaging we use for the majority of our coffee and tea
                                    products is 100% compostable. We use a couple of different
                                    biodegradable plastics for our packaging, including polylactic
                                    acid (PLA) made from fermented plant starches, and polyutylene
                                    adipate terephthalate (PBAT), made from petrochemical-based
                                    monomers. We also use cardboard packaging when appropriate, as{" "}
                                    {`it's`} another material that is very widely recyclable in the
                                    UK.
                                </p>

                                <p className={styles["sustainability-main-section-body-text"]}>
                                    Unfortunately, PLA {`isn't`} home-compostable like PBAT; it
                                    requires much more heat to be broken down than a typical home
                                    compost bin is capable of providing, and facilities that accept
                                    it {`aren't`} yet widespread in the UK. We aim to use the more
                                    sustainable options where appropriate and possible.
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
                                    Single-use plastics, while cheap and convenient, are horrible
                                    for the environment. They can take up to hundreds of years to
                                    fully decompose, and often end up in either landfill or the
                                    ocean, creating pollution and causing harm to wildlife. As a
                                    result, we avoid using these wherever possible, opting for more
                                    sustainable packaging options.
                                </p>

                                <p className={styles["sustainability-main-section-body-text"]}>
                                    While many other companies that produce coffee pods use
                                    single-use plastics, our coffee pods are made from PHA: a
                                    biopolymer created from natural sources, making them
                                    biodegradable and compostable at home while leaving behind no
                                    microplastics. They also have an oxygen barrier inside in order
                                    to keep your coffee fresher for longer.
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
                                    Our in-house team of roasters work hard every day to create
                                    memorable, delicious, aromatic coffee and tea. They pride
                                    themselves on their ability to make a consistently tasty blend,
                                    so you can always be certain {`you're`} getting the best out of
                                    every cup. They also acknowledge the ethical origins of the
                                    produce they work with and take care to preserve all the best
                                    characteristics that make great coffee and tea.
                                </p>

                                <p className={styles["sustainability-main-section-body-text"]}>
                                    However, they {`aren't`} the only ones. Every employee shares
                                    our vision for the future: the best things in life can be
                                    sustainable. Our carbon negative operations and
                                    recyclable/compostable packaging methods mean that when{" "}
                                    {`you're`} drinking our coffee and tea, you can feel good about
                                    it.
                                </p>

                                <p className={styles["sustainability-main-section-body-text"]}>
                                    When {`we're`} talking about our team, we consider{" "}
                                    <strong>you</strong> a part of it. Every time you buy something
                                    from us, {`you're`} showing the world you believe in ethical,
                                    sustainable, environmentally-friendly produce, and we think{" "}
                                    {`that's`} a pretty great thing.
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

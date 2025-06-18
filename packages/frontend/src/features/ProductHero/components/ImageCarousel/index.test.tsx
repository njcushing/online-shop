import { screen, render, within, userEvent, fireEvent } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { ImageCarousel, TImageCarousel } from ".";

// Mock dependencies
const mockProps: TImageCarousel = {
    images: [
        { src: "image1Src", alt: "image1Alt" },
        { src: "image2Src", alt: "image2Alt" },
    ],
    awaiting: false,
};

type renderFuncArgs = {
    propsOverride?: TImageCarousel;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { propsOverride, initRender = false } = args;

    function Component({ props }: { props?: renderFuncArgs["propsOverride"] }) {
        const mergedProps = _.merge(_.cloneDeep(mockProps), props);

        return <ImageCarousel {...mergedProps} />;
    }

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender
        ? render(<Component props={propsOverride} />)
        : await act(() => render(<Component props={propsOverride} />));

    return {
        rerenderFunc: (newArgs: renderFuncArgs) => {
            rerender(<Component props={newArgs.propsOverride} />);
        },
        component: <Component props={propsOverride} />,
    };
};

describe("The ImageCarousel component...", () => {
    describe("For each image in the 'images' array prop...", () => {
        describe("Should render an element with a 'button' role...", () => {
            describe("Containing an <img> element...", () => {
                test("With the correct 'src' and 'alt' attributes for that image", async () => {
                    renderFunc();

                    mockProps.images.forEach((image, i) => {
                        const { src, alt } = image;

                        const slideElement = screen.getByRole("button", {
                            name: `View image ${i + 1} of ${mockProps.images.length}`,
                        });

                        const imgElement = within(slideElement).getByRole("img", { name: alt });
                        expect(imgElement.getAttribute("src")).toBe(src);
                    });
                });

                test("Unless the 'awaiting' prop is set to 'true'", () => {
                    renderFunc({ propsOverride: { awaiting: true } as TImageCarousel });

                    mockProps.images.forEach((image, i) => {
                        const slideElement = screen.getByRole("button", {
                            name: `View image ${i + 1} of ${mockProps.images.length}`,
                        });
                        expect(slideElement).toBeInTheDocument();

                        const imgElement = within(slideElement).queryByRole("img");
                        expect(imgElement).not.toBeInTheDocument();
                    });
                });
            });

            test("That should have a 'data-selected' boolean attribute", async () => {
                renderFunc();

                const allSlideElements = mockProps.images.map((image, i) => {
                    return screen.getByRole("button", {
                        name: `View image ${i + 1} of ${mockProps.images.length}`,
                    });
                });

                allSlideElements.forEach((slideElement) => {
                    expect(slideElement.getAttribute("data-selected")).toBeDefined();
                });
            });

            test("Only first of which should have this attribute set to 'true'", async () => {
                renderFunc();

                const allSlideElements = mockProps.images.map((image, i) => {
                    return screen.getByRole("button", {
                        name: `View image ${i + 1} of ${mockProps.images.length}`,
                    });
                });

                allSlideElements.forEach((slideElement, i) => {
                    const isFirstIndex = i === 0;
                    const selected = isFirstIndex ? "true" : "false";

                    expect(slideElement.getAttribute("data-selected")).toBe(selected);
                });
            });

            test("That should, on click, set the 'data-selected' attribute to 'true' on that element", async () => {
                await renderFunc();

                const allSlideElements = mockProps.images.map((image, i) => {
                    return screen.getByRole("button", {
                        name: `View image ${i + 1} of ${mockProps.images.length}`,
                    });
                });

                expect(allSlideElements[0].getAttribute("data-selected")).toBe("true");
                expect(allSlideElements[1].getAttribute("data-selected")).toBe("false");

                await act(async () => userEvent.click(allSlideElements[1]));

                expect(allSlideElements[0].getAttribute("data-selected")).toBe("false");
                expect(allSlideElements[1].getAttribute("data-selected")).toBe("true");
            });

            test("That should, when focussed and either the 'Enter' key or spacebar are pressed, set the 'data-selected' attribute to 'true' on that element", async () => {
                await renderFunc();

                const allSlideElements = mockProps.images.map((image, i) => {
                    return screen.getByRole("button", {
                        name: `View image ${i + 1} of ${mockProps.images.length}`,
                    });
                });

                expect(allSlideElements[0].getAttribute("data-selected")).toBe("true");
                expect(allSlideElements[1].getAttribute("data-selected")).toBe("false");

                await act(async () => fireEvent.focus(allSlideElements[1]));
                await act(async () => fireEvent.keyDown(allSlideElements[1], { key: "Enter" }));

                expect(allSlideElements[0].getAttribute("data-selected")).toBe("false");
                expect(allSlideElements[1].getAttribute("data-selected")).toBe("true");

                await act(async () => fireEvent.focus(allSlideElements[0]));
                await act(async () => fireEvent.keyDown(allSlideElements[0], { key: "Spacebar" }));

                expect(allSlideElements[0].getAttribute("data-selected")).toBe("true");
                expect(allSlideElements[1].getAttribute("data-selected")).toBe("false");
            });
        });

        describe("Should render an additional <img> element for the larger carousel", () => {
            test("With the correct 'src' and 'alt' attributes for that image", () => {
                renderFunc();

                mockProps.images.forEach((image) => {
                    const { alt } = image;

                    const imgElements = screen.getAllByRole("img", { name: alt });
                    expect(imgElements).toHaveLength(2);
                });
            });

            test("Unless the 'awaiting' prop is set to 'true'", () => {
                renderFunc({ propsOverride: { awaiting: true } as TImageCarousel });

                mockProps.images.forEach((image) => {
                    const { alt } = image;

                    const imgElements = screen.queryAllByRole("img", { name: alt });
                    expect(imgElements).toHaveLength(0);
                });
            });
        });
    });

    describe("Should render a 'Next image' button", () => {
        test("As expected", () => {
            renderFunc();

            const nextImageButton = screen.getByRole("button", { name: "Next image" });
            expect(nextImageButton).toBeInTheDocument();
        });

        test("Unless the 'awaiting' prop is set to 'true'", () => {
            renderFunc({ propsOverride: { awaiting: true } as TImageCarousel });

            const nextImageButton = screen.queryByRole("button", { name: "Next image" });
            expect(nextImageButton).not.toBeInTheDocument();
        });

        test("That should, on click, set the 'data-selected' attribute to 'true' on the next slide", async () => {
            await renderFunc();

            const nextImageButton = screen.getByRole("button", { name: "Next image" });

            const allSlideElements = mockProps.images.map((image, i) => {
                return screen.getByRole("button", {
                    name: `View image ${i + 1} of ${mockProps.images.length}`,
                });
            });

            expect(allSlideElements[0].getAttribute("data-selected")).toBe("true");
            expect(allSlideElements[1].getAttribute("data-selected")).toBe("false");

            await act(async () => userEvent.click(nextImageButton));

            expect(allSlideElements[0].getAttribute("data-selected")).toBe("false");
            expect(allSlideElements[1].getAttribute("data-selected")).toBe("true");
        });

        test("Unless the selected slide is the final one", async () => {
            await renderFunc();

            const nextImageButton = screen.getByRole("button", { name: "Next image" });

            const allSlideElements = mockProps.images.map((image, i) => {
                return screen.getByRole("button", {
                    name: `View image ${i + 1} of ${mockProps.images.length}`,
                });
            });

            expect(allSlideElements[0].getAttribute("data-selected")).toBe("true");
            expect(allSlideElements[1].getAttribute("data-selected")).toBe("false");

            await act(async () => userEvent.click(nextImageButton));

            expect(allSlideElements[0].getAttribute("data-selected")).toBe("false");
            expect(allSlideElements[1].getAttribute("data-selected")).toBe("true");

            await act(async () => userEvent.click(nextImageButton));

            expect(allSlideElements[0].getAttribute("data-selected")).toBe("false");
            expect(allSlideElements[1].getAttribute("data-selected")).toBe("true");
        });
    });

    describe("Should render a 'Previous image' button", () => {
        test("As expected", () => {
            renderFunc();

            const previousImageButton = screen.getByRole("button", { name: "Previous image" });
            expect(previousImageButton).toBeInTheDocument();
        });

        test("Unless the 'awaiting' prop is set to 'true'", () => {
            renderFunc({ propsOverride: { awaiting: true } as TImageCarousel });

            const previousImageButton = screen.queryByRole("button", { name: "Previous image" });
            expect(previousImageButton).not.toBeInTheDocument();
        });

        test("That should, on click, set the 'data-selected' attribute to 'true' on the next slide", async () => {
            await renderFunc();

            const nextImageButton = screen.getByRole("button", { name: "Next image" });

            const previousImageButton = screen.getByRole("button", { name: "Previous image" });
            expect(previousImageButton).toBeInTheDocument();

            const allSlideElements = mockProps.images.map((image, i) => {
                return screen.getByRole("button", {
                    name: `View image ${i + 1} of ${mockProps.images.length}`,
                });
            });

            expect(allSlideElements[0].getAttribute("data-selected")).toBe("true");
            expect(allSlideElements[1].getAttribute("data-selected")).toBe("false");

            await act(async () => userEvent.click(nextImageButton));

            expect(allSlideElements[0].getAttribute("data-selected")).toBe("false");
            expect(allSlideElements[1].getAttribute("data-selected")).toBe("true");

            await act(async () => userEvent.click(previousImageButton));

            expect(allSlideElements[0].getAttribute("data-selected")).toBe("true");
            expect(allSlideElements[1].getAttribute("data-selected")).toBe("false");
        });

        test("Unless the selected image is the final image", async () => {
            await renderFunc();

            const previousImageButton = screen.getByRole("button", { name: "Previous image" });
            expect(previousImageButton).toBeInTheDocument();

            const allSlideElements = mockProps.images.map((image, i) => {
                return screen.getByRole("button", {
                    name: `View image ${i + 1} of ${mockProps.images.length}`,
                });
            });

            expect(allSlideElements[0].getAttribute("data-selected")).toBe("true");
            expect(allSlideElements[1].getAttribute("data-selected")).toBe("false");

            await act(async () => userEvent.click(previousImageButton));

            expect(allSlideElements[0].getAttribute("data-selected")).toBe("true");
            expect(allSlideElements[1].getAttribute("data-selected")).toBe("false");
        });
    });
});

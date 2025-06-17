import { screen, render, userEvent } from "@test-utils";
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
        describe("Should render two <img> elements...", () => {
            test("One for the large carousel, and one as a thumbnail", () => {
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

            describe("The thumbnail image...", () => {
                test("Should have a 'data-selected' boolean attribute", () => {
                    renderFunc();

                    mockProps.images.forEach((image) => {
                        const { alt } = image;

                        const imgElements = screen.getAllByRole("img", { name: alt });

                        expect(imgElements[0].getAttribute("data-selected")).toBeNull();
                        expect(imgElements[1].getAttribute("data-selected")).toBeDefined();
                    });
                });

                test("That should be true for the first image by default", () => {
                    renderFunc();

                    mockProps.images.forEach((image, i) => {
                        const { alt } = image;

                        const imgElements = screen.getAllByRole("img", { name: alt });

                        const isFirstIndex = i === 0;
                        const selected = isFirstIndex ? "true" : "false";

                        expect(imgElements[0].getAttribute("data-selected")).toBeNull();
                        expect(imgElements[1].getAttribute("data-selected")).toBe(selected);
                    });
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

        test("That should, on click, set the 'data-selected' attribute to 'true' on the next image", async () => {
            await renderFunc();

            const nextImageButton = screen.getByRole("button", { name: "Next image" });

            const allImgElements = mockProps.images.map((image) => {
                const { alt } = image;

                return screen.getAllByRole("img", { name: alt });
            });

            expect(allImgElements[0][1].getAttribute("data-selected")).toBe("true");
            expect(allImgElements[1][1].getAttribute("data-selected")).toBe("false");

            await act(async () => userEvent.click(nextImageButton));

            expect(allImgElements[0][1].getAttribute("data-selected")).toBe("false");
            expect(allImgElements[1][1].getAttribute("data-selected")).toBe("true");
        });

        test("Unless the selected image is the final image", async () => {
            await renderFunc();

            const nextImageButton = screen.getByRole("button", { name: "Next image" });

            const allImgElements = mockProps.images.map((image) => {
                const { alt } = image;

                return screen.getAllByRole("img", { name: alt });
            });

            expect(allImgElements[0][1].getAttribute("data-selected")).toBe("true");
            expect(allImgElements[1][1].getAttribute("data-selected")).toBe("false");

            await act(async () => userEvent.click(nextImageButton));

            expect(allImgElements[0][1].getAttribute("data-selected")).toBe("false");
            expect(allImgElements[1][1].getAttribute("data-selected")).toBe("true");

            await act(async () => userEvent.click(nextImageButton));

            expect(allImgElements[0][1].getAttribute("data-selected")).toBe("false");
            expect(allImgElements[1][1].getAttribute("data-selected")).toBe("true");
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

        test("That should, on click, set the 'data-selected' attribute to 'true' on the next image", async () => {
            await renderFunc();

            const nextImageButton = screen.getByRole("button", { name: "Next image" });

            const previousImageButton = screen.getByRole("button", { name: "Previous image" });
            expect(previousImageButton).toBeInTheDocument();

            const allImgElements = mockProps.images.map((image) => {
                const { alt } = image;

                return screen.getAllByRole("img", { name: alt });
            });

            expect(allImgElements[0][1].getAttribute("data-selected")).toBe("true");
            expect(allImgElements[1][1].getAttribute("data-selected")).toBe("false");

            await act(async () => userEvent.click(nextImageButton));

            expect(allImgElements[0][1].getAttribute("data-selected")).toBe("false");
            expect(allImgElements[1][1].getAttribute("data-selected")).toBe("true");

            await act(async () => userEvent.click(previousImageButton));

            expect(allImgElements[0][1].getAttribute("data-selected")).toBe("true");
            expect(allImgElements[1][1].getAttribute("data-selected")).toBe("false");
        });

        test("Unless the selected image is the final image", async () => {
            await renderFunc();

            const previousImageButton = screen.getByRole("button", { name: "Previous image" });
            expect(previousImageButton).toBeInTheDocument();

            const allImgElements = mockProps.images.map((image) => {
                const { alt } = image;

                return screen.getAllByRole("img", { name: alt });
            });

            expect(allImgElements[0][1].getAttribute("data-selected")).toBe("true");
            expect(allImgElements[1][1].getAttribute("data-selected")).toBe("false");

            await act(async () => userEvent.click(previousImageButton));

            expect(allImgElements[0][1].getAttribute("data-selected")).toBe("true");
            expect(allImgElements[1][1].getAttribute("data-selected")).toBe("false");
        });
    });
});

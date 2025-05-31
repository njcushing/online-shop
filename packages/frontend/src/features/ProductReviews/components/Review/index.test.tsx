import { screen, render } from "@test-utils";
import _ from "lodash";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { Review, TReview } from ".";

// Mock dependencies
const mockReview: TReview["data"] = {
    id: "reviewId",
    productId: "productId",
    variantId: "variantId",
    userId: "userId",
    rating: 5,
    comment: "Review comment",
    images: [],
    datePosted: new Date(0).toISOString(),
};

const mockProps: RecursivePartial<TReview> = {
    data: mockReview,
    awaiting: false,
};

type renderFuncArgs = {
    propsOverride?: TReview;
};
const renderFunc = (args: renderFuncArgs = {}) => {
    const { propsOverride } = args;

    const mergedProps = _.merge(_.cloneDeep(mockProps), propsOverride);

    const component = (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Review {...mergedProps} />
        </BrowserRouter>
    );

    const result = render(component);

    return {
        ...result,
        component,
    };
};

describe("The Review component...", () => {
    afterEach(() => {
        window.history.pushState({}, "", "/");
    });

    describe("Should render an element displaying the date the review was posted...", () => {
        test("In the format: 'Month Day, Year'", () => {
            renderFunc();

            const datePostedElement = screen.getByText("January 1, 1970", { exact: false });
            expect(datePostedElement).toBeInTheDocument();
        });

        test("Unless the 'awaiting' prop is set to 'true'", () => {
            renderFunc({ propsOverride: { awaiting: true } });

            const datePostedElement = screen.queryByText("January 1, 1970", { exact: false });
            expect(datePostedElement).not.toBeInTheDocument();
        });

        test("Unless both the 'data' and 'awaiting' props are falsy", () => {
            // Have to use 'null' instead of 'undefined' here - lodash 'merge' doesn't merge undefined fields
            // @ts-expect-error - Disabling type checking for function parameters in unit test
            renderFunc({ propsOverride: { data: null } });

            const datePostedElement = screen.queryByText("January 1, 1970", { exact: false });
            expect(datePostedElement).not.toBeInTheDocument();
        });
    });
});

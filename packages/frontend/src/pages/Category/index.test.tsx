import { vi } from "vitest";
import { screen, render } from "@test-utils";
import _ from "lodash";
import { act } from "react";
import { RecursivePartial } from "@/utils/types";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { mockCategories } from "./index.mocks";
import { ICategoryContext, CategoryContext, Category } from ".";

// Mock dependencies
const mockCategoryContext: RecursivePartial<ICategoryContext> = {
    urlPathFull: "",
    urlPathSplit: [],
    categoryData: [],
};

type renderFuncArgs = {
    CategoryContextOverride?: ICategoryContext;
    initRender?: boolean;
};
const renderFunc = async (args: renderFuncArgs = {}) => {
    const { CategoryContextOverride, initRender = false } = args;

    let CategoryContextValue!: ICategoryContext;

    const mergedCategoryContext = _.merge(
        _.cloneDeep(mockCategoryContext),
        CategoryContextOverride,
    );

    const component = (
        // Using RouterProvider for useParams hook from react-router-dom
        <RouterProvider
            router={createBrowserRouter(
                [
                    {
                        path: "c/*",
                        element: (
                            <CategoryContext.Provider value={mergedCategoryContext}>
                                <Category>
                                    <CategoryContext.Consumer>
                                        {(value) => {
                                            CategoryContextValue = value;
                                            return null;
                                        }}
                                    </CategoryContext.Consumer>
                                </Category>
                            </CategoryContext.Provider>
                        ),
                        errorElement: <div aria-label="Error element"></div>,
                    },
                ],
                {
                    future: {
                        v7_relativeSplatPath: true,
                    },
                },
            )}
            future={{ v7_startTransition: true }}
        />
    );

    // When using initRender, must wrap 'expect' in 'await waitFor'
    const { rerender } = initRender ? render(component) : await act(() => render(component));

    return {
        rerender,
        getCategoryContextValue: () => CategoryContextValue,
        component,
    };
};

vi.mock("@/utils/products/categories", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        categories: (await import("./index.mocks")).mockCategories,
    };
});

vi.mock("@/features/CategoryHero", () => ({
    CategoryHero: () => <div aria-label="CategoryHero component"></div>,
}));

vi.mock("@/features/ProductList", () => ({
    ProductList: () => <div aria-label="ProductList component"></div>,
}));

describe("The Category component...", () => {
    beforeEach(() => {
        window.history.pushState({}, "", `/c/${mockCategories[0]!.slug}`);
    });

    describe("Should provide context to all its descendant components...", () => {
        test("Which should be defined", async () => {
            const { getCategoryContextValue } = await renderFunc();
            const CategoryContextValue = getCategoryContextValue();
            expect(CategoryContextValue).toBeDefined();
        });

        describe("Including the 'urlPathFull' field...", () => {
            test("Which should match the part of the URL path following 'c/'", async () => {
                const { getCategoryContextValue } = await renderFunc();
                const CategoryContextValue = getCategoryContextValue();

                const { urlPathFull } = CategoryContextValue;
                expect(urlPathFull).toBeDefined();

                expect(urlPathFull).toBe("category-1-slug");
            });
        });

        describe("Including the 'urlPathSplit' field: an array of the subcategories of the URL path following 'c/'", () => {
            test("Which should be an array of the subcategories of the URL path following 'c/'", async () => {
                const path = `/c/${mockCategories[0]!.slug}/${mockCategories[0]!.subcategories![0].slug}`;
                window.history.pushState({}, "", path);

                const { getCategoryContextValue } = await renderFunc();
                const CategoryContextValue = getCategoryContextValue();

                const { urlPathSplit } = CategoryContextValue;
                expect(urlPathSplit).toBeDefined();

                expect(urlPathSplit).toStrictEqual([
                    mockCategories[0]!.slug,
                    mockCategories[0]!.subcategories![0].slug,
                ]);
            });
        });

        describe("Including the 'categoryData' field...", () => {
            test("Which should be an array containing data about each category and subcategory that comprises the URL path following 'c/'", async () => {
                const path = `/c/${mockCategories[0]!.slug}/${mockCategories[0]!.subcategories![0].slug}`;
                window.history.pushState({}, "", path);

                const { getCategoryContextValue } = await renderFunc();
                const CategoryContextValue = getCategoryContextValue();

                const { categoryData } = CategoryContextValue;
                expect(categoryData).toBeDefined();

                expect(categoryData).toStrictEqual([
                    mockCategories[0],
                    mockCategories[0]!.subcategories![0],
                ]);
            });
        });

        describe("Which, when consumed by a component other than the Category component...", () => {
            test("Should match the shape of the expected context, but have fields containing default values", async () => {
                let CategoryContextValue!: ICategoryContext;

                render(
                    <div>
                        <CategoryContext.Consumer>
                            {(value) => {
                                CategoryContextValue = value;
                                return null;
                            }}
                        </CategoryContext.Consumer>
                    </div>,
                );

                expect(CategoryContextValue).toBeDefined();

                const { urlPathFull, urlPathSplit, categoryData } = CategoryContextValue;

                expect(urlPathFull).toBeDefined();
                expect(urlPathSplit).toBeDefined();
                expect(categoryData).toBeDefined();
            });
        });
    });

    test("Should render the CategoryHero component", async () => {
        await renderFunc();

        const CategoryHeroComponent = screen.getByLabelText("CategoryHero component");
        expect(CategoryHeroComponent).toBeInTheDocument();
    });

    test("Should render the ProductList component", async () => {
        await renderFunc();

        const ProductListComponent = screen.getByLabelText("ProductList component");
        expect(ProductListComponent).toBeInTheDocument();
    });

    describe("Or, should render the router's errorElement...", () => {
        beforeEach(() => {
            // Expecting errors to be thrown in tests - suppressing to avoid cluttering terminal
            vi.spyOn(console, "error").mockImplementation(() => {});
        });

        afterEach(() => {
            vi.spyOn(console, "error").mockRestore();
        });

        test("If the 'urlPathSplit' context field has a length of 0", async () => {
            window.history.pushState({}, "", "/c");

            await renderFunc();

            const ErrorElement = screen.getByLabelText("Error element");
            expect(ErrorElement).toBeInTheDocument();
        });

        test("If a matched category has no subcategories array but the current stage of the URL path has not been reached", async () => {
            const path = `/c/${mockCategories[0]!.slug}/${mockCategories[0]!.subcategories![0].slug}/invalid-subcategory`;
            window.history.pushState({}, "", path);

            await renderFunc();

            const ErrorElement = screen.getByLabelText("Error element");
            expect(ErrorElement).toBeInTheDocument();
        });

        test("If the URL path doesn't resolve to valid category/subcategory", async () => {
            window.history.pushState({}, "", "/c/invalid-category");

            await renderFunc();

            const ErrorElement = screen.getByLabelText("Error element");
            expect(ErrorElement).toBeInTheDocument();
        });
    });
});

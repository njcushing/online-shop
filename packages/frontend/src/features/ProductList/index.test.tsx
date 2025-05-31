import { vi } from "vitest";
import { screen, render } from "@test-utils";
import _ from "lodash";
import { ICategoryContext, CategoryContext } from "@/pages/Category";
import { RecursivePartial } from "@/utils/types";
import { BrowserRouter } from "react-router-dom";
import { ProductList } from ".";

// Mock dependencies

// Only using fields relevant to the ProductList component
const mockProducts = Array.from({ length: 21 }).map((v, i) => ({ id: `${i + 1}` }));
const mockCategoryContext: RecursivePartial<ICategoryContext> = {
    categoryData: [
        {
            slug: "category-1-slug",
            name: "Category 1",
            description: "Category 1 description",
            products: ["1", "2", "3"],
            subcategories: [
                {
                    slug: "category-1a-slug",
                    name: "Category 1a",
                    description: "Category 1a description",
                    products: ["4", "5", "6"],
                    subcategories: [
                        {
                            slug: "category-1aa",
                            name: "Category 1aa",
                            description: "Category 1aa description",
                            products: ["7", "8", "9"],
                            subcategories: [
                                {
                                    slug: "category-1aaa",
                                    name: "Category 1aaa",
                                    description: "Category 1aaa description",
                                    products: ["16", "17", "18"],
                                },
                                {
                                    slug: "category-1aab",
                                    name: "Category 1aab",
                                    description: "Category 1aab description",
                                    products: ["19", "20", "21"],
                                },
                            ],
                        },
                        {
                            slug: "category-1ab",
                            name: "Category 1ab",
                            description: "Category 1ab description",
                            products: ["10", "11", "12"],
                        },
                    ],
                },
                {
                    slug: "category-1b-slug",
                    name: "Category 1b",
                    description: "Category 1b description",
                    products: ["13", "14", "15"],
                },
            ],
        },
        {
            slug: "category-1a-slug",
            name: "Category 1a",
            description: "Category 1a description",
            products: ["4", "5", "6"],
            subcategories: [
                {
                    slug: "category-1aa",
                    name: "Category 1aa",
                    description: "Category 1aa description",
                    products: ["7", "8", "9"],
                    subcategories: [
                        {
                            slug: "category-1aaa",
                            name: "Category 1aaa",
                            description: "Category 1aaa description",
                            products: ["16", "17", "18"],
                        },
                        {
                            slug: "category-1aab",
                            name: "Category 1aab",
                            description: "Category 1aab description",
                            products: ["19", "20", "21"],
                        },
                    ],
                },
                {
                    slug: "category-1ab",
                    name: "Category 1ab",
                    description: "Category 1ab description",
                    products: ["10", "11", "12"],
                },
            ],
        },
    ],
};

type renderFuncArgs = {
    CategoryContextOverride?: ICategoryContext;
};
const renderFunc = (args: renderFuncArgs = {}) => {
    const { CategoryContextOverride } = args;

    let CategoryContextValue!: ICategoryContext;

    const mergedCategoryContext = _.merge(
        _.cloneDeep(structuredClone(mockCategoryContext)),
        CategoryContextOverride,
    );

    const component = (
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <CategoryContext.Provider value={mergedCategoryContext}>
                <CategoryContext.Consumer>
                    {(value) => {
                        CategoryContextValue = value;
                        return null;
                    }}
                </CategoryContext.Consumer>
                <ProductList />
            </CategoryContext.Provider>
        </BrowserRouter>
    );

    const { rerender } = render(component);

    return {
        rerender,
        CategoryContextValue,
        component,
    };
};

const mockFindProductFromId = vi.fn((pId: string) => {
    return mockProducts.find((product) => product.id === pId);
});
vi.mock("@/utils/products/product", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...(actual || {}),
        findProductFromId: (pId: string) => mockFindProductFromId(pId),
    };
});

vi.mock("@/features/ProductCard", () => ({
    ProductCard: vi.fn((props: { productData: (typeof mockProducts)[number]; key: string }) => {
        return (
            <div
                aria-label={`ProductCard component ${props.productData.id}`}
                data-props={JSON.stringify(props)}
            ></div>
        );
    }),
}));

describe("The ProductList component...", () => {
    describe("For each product in the last 'categoryData' entry...", () => {
        test("Should render a ProductCard component", () => {
            renderFunc();

            const { categoryData } = mockCategoryContext;
            categoryData![categoryData!.length - 1]!.products!.forEach((id) => {
                const ProductCardComponent = screen.getByLabelText(`ProductCard component ${id}`);
                expect(ProductCardComponent).toBeInTheDocument();
            });
        });

        test("Unless those products' ids don't match a valid product's id", () => {
            mockFindProductFromId.mockReturnValue(undefined);

            renderFunc();

            const { categoryData } = mockCategoryContext;
            categoryData![categoryData!.length - 1]!.products!.forEach((id) => {
                const ProductCardComponent = screen.queryByLabelText(`ProductCard component ${id}`);
                expect(ProductCardComponent).not.toBeInTheDocument();
            });

            mockFindProductFromId.mockRestore();
        });
    });

    describe("For each product in each top-level subcategory in the last 'categoryData' entry...", () => {
        test("Should render a heading element with text equal to the subcategory's 'name' field", () => {
            renderFunc();

            const { categoryData } = mockCategoryContext;
            categoryData![categoryData!.length - 1]!.subcategories!.forEach((subcategory) => {
                const { name } = subcategory;

                const subcategoryHeading = screen.getByRole("heading", { name });
                expect(subcategoryHeading).toBeInTheDocument();
            });
        });

        test("Should render a paragraph element with text equal to the subcategory's 'description' field", () => {
            renderFunc();

            const { categoryData } = mockCategoryContext;
            categoryData![categoryData!.length - 1]!.subcategories!.forEach((subcategory) => {
                const { description } = subcategory;

                const subcategoryDescription = screen.getByText(description);
                expect(subcategoryDescription).toBeInTheDocument();
            });
        });

        test("Should render a Mantine NavLink component with an 'href' attribuite equal to the subcategory's 'slug'", () => {
            renderFunc();

            const NavLinkComponents = screen.getAllByRole("link");

            expect(window.location.pathname).toBe("/");

            const { categoryData } = mockCategoryContext;
            categoryData![categoryData!.length - 1]!.subcategories!.forEach(async (subcategory) => {
                const { slug } = subcategory;

                const relevantLink = NavLinkComponents.find((NavLink) => {
                    return NavLink.getAttribute("href") === `/${slug}`;
                });
                expect(relevantLink).toBeDefined();
            });
        });

        test("Should render a ProductCard component", () => {
            renderFunc();

            const { categoryData } = mockCategoryContext;
            categoryData![categoryData!.length - 1]!.subcategories!.forEach((subcategory) => {
                const { products } = subcategory;

                products!.forEach((id) => {
                    const ProductCardComponent = screen.getByLabelText(
                        `ProductCard component ${id}`,
                    );
                    expect(ProductCardComponent).toBeInTheDocument();
                });
            });
        });

        test("Unless those products' ids don't match a valid product's id", () => {
            mockFindProductFromId.mockReturnValue(undefined);

            renderFunc();

            const { categoryData } = mockCategoryContext;
            categoryData![categoryData!.length - 1]!.subcategories!.forEach((subcategory) => {
                const { products } = subcategory;

                products!.forEach((id) => {
                    const ProductCardComponent = screen.queryByLabelText(
                        `ProductCard component ${id}`,
                    );
                    expect(ProductCardComponent).not.toBeInTheDocument();
                });
            });

            mockFindProductFromId.mockRestore();
        });
    });
});

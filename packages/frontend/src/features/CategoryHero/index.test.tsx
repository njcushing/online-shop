import { screen, render, userEvent } from "@test-utils";
import _ from "lodash";
import { ICategoryContext, CategoryContext } from "@/pages/Category";
import { RecursivePartial } from "@/utils/types";
import { act } from "react";
import { BrowserRouter } from "react-router-dom";
import { CategoryHero } from ".";

// Mock dependencies
const mockCategoryContext: RecursivePartial<ICategoryContext> = {
    // Only using fields relevant to the CategoryHero component
    urlPathSplit: ["category-1-slug", "category-1a-slug", "category-1aa-slug"],
    categoryData: [
        {
            slug: "category-1-slug",
            name: "Category 1",
            description: "Category 1 description",
            subcategories: [
                {
                    slug: "category-1a-slug",
                    name: "Category 1a",
                    description: "Category 1a description",
                    subcategories: [
                        {
                            slug: "category-1aa-slug",
                            name: "Category 1aa",
                            description: "Category 1aa description",
                            subcategories: [
                                {
                                    slug: "category-1aaa-slug",
                                    name: "Category 1aaa",
                                    description: "Category 1aaa description",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            slug: "category-1a-slug",
            name: "Category 1a",
            description: "Category 1a description",
            subcategories: [
                {
                    slug: "category-1aa-slug",
                    name: "Category 1aa",
                    description: "Category 1aa description",
                    subcategories: [
                        {
                            slug: "category-1aaa-slug",
                            name: "Category 1aaa",
                            description: "Category 1aaa description",
                        },
                    ],
                },
            ],
        },
        {
            slug: "category-1aa-slug",
            name: "Category 1aa",
            description: "Category 1aa description",
            subcategories: [
                {
                    slug: "category-1aaa-slug",
                    name: "Category 1aaa",
                    description: "Category 1aaa description",
                    img: { src: "category-1aaa-img-src", alt: "category-1aaa-img-alt" },
                },
                {
                    slug: "category-1aab-slug",
                    name: "Category 1aab",
                    description: "Category 1aaa description",
                    img: { src: "category-1aab-img-src", alt: "category-1aab-img-alt" },
                },
            ],
        },
    ] as RecursivePartial<ICategoryContext>["categoryData"],
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
        // Using BrowserRouter for Link component(s)
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
                <CategoryHero />
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

describe("The CategoryHero component...", () => {
    beforeEach(() => {
        window.history.pushState({}, "", "/");
    });

    describe("Should render a react-router-dom Link component...", () => {
        test("With the text: 'Home' and an 'href' attribute equal to '/'", () => {
            renderFunc();

            const HomeLinkComponent = screen.getByRole("link", { name: "Home" });
            expect(HomeLinkComponent).toBeInTheDocument();
            expect(HomeLinkComponent.getAttribute("href")).toBe("/");
        });

        describe("For each ancestor category...", () => {
            test("With text equal to that category's 'name' field", () => {
                renderFunc();

                mockCategoryContext.categoryData!.slice(0, -1).forEach((category) => {
                    const { name } = category!;

                    expect(screen.getByRole("link", { name })).toBeInTheDocument();
                });
            });

            test("And an 'href' attribute equal to the joined heirarchy of categories ending in the selected category", () => {
                renderFunc();

                const subDirectoryLevel = 2;

                const SubdirectoryLinkComponent = screen.getByRole("link", {
                    name: mockCategoryContext.categoryData![subDirectoryLevel - 1]!.name,
                });

                const expectedPath = `/c/${[...mockCategoryContext.urlPathSplit!.slice(0, subDirectoryLevel)].join("/")}`;

                expect(SubdirectoryLinkComponent.getAttribute("href")).toBe(expectedPath);
            });
        });
    });

    test("Should render a heading element with text equal to the 'name' field of the current directory", () => {
        renderFunc();

        const currentDirectoryName = screen.getByRole("heading", {
            name: mockCategoryContext.categoryData!.at(-1)!.name!,
        });
        expect(currentDirectoryName).toBeInTheDocument();
    });

    test("Should render a paragraph element with text equal to the 'description' field of the current directory", () => {
        renderFunc();

        const currentDirectoryDescription = screen.getByText(
            mockCategoryContext.categoryData!.at(-1)!.description!,
        );
        expect(currentDirectoryDescription).toBeInTheDocument();
    });

    describe("Should render <nav> elements for each subcategory of the current category...", () => {
        describe("Containing react-router-dom Link components...", () => {
            test("With an 'href' attribute equal to that subcategory's 'slug' field", async () => {
                renderFunc();

                mockCategoryContext.categoryData!.at(-1)!.subcategories!.forEach((subcategory) => {
                    const { slug, name, img } = subcategory!;
                    const { alt } = img!;

                    // Link contains both visible text and an <img> element with alt text
                    const SubdirectoryLinkComponent = screen.getByRole("link", {
                        name: `${alt} ${name}`,
                    });

                    expect(SubdirectoryLinkComponent).toBeInTheDocument();
                    expect(SubdirectoryLinkComponent.getAttribute("href")).toBe(`/${slug}`);
                });
            });

            test("That, on click, should redirect the user to that subcategory's 'slug' field", async () => {
                renderFunc();

                const { subcategories } = mockCategoryContext.categoryData!.at(-1)!;

                for (let i = 0; i < subcategories!.length; i += 1) {
                    const subcategory = subcategories![i]!;
                    const { slug, name, img } = subcategory!;
                    const { alt } = img!;

                    // Link contains both visible text and an <img> element with alt text
                    const SubdirectoryLinkComponent = screen.getByRole("link", {
                        name: `${alt} ${name}`,
                    });

                    // Need to click each Link one at a time and await the change in URL path
                    /* eslint-disable-next-line no-await-in-loop */
                    await act(async () => userEvent.click(SubdirectoryLinkComponent));

                    expect(window.location.pathname).toBe(`/${slug}`);
                }
            });
        });

        test("And <img> elements with the correct 'src' and 'alt' attributes", async () => {
            renderFunc();

            mockCategoryContext.categoryData!.at(-1)!.subcategories!.forEach((subcategory) => {
                const { img } = subcategory!;
                const { src, alt } = img!;

                const image = screen.getByRole("img", { name: alt });

                expect(image).toBeInTheDocument();
                expect(image.getAttribute("src")).toBe(src);
            });
        });
    });
});

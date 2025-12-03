import { defaultPageSize, ICategoryProductListContext } from "..";

export const createSearchParams = (params: {
    filters: ICategoryProductListContext["filterSelections"];
    sort: ICategoryProductListContext["sortSelection"];
    page: number;
    pageSize: number;
}): URLSearchParams => {
    const { filters, sort, page, pageSize } = params;

    const searchParams = new URLSearchParams();

    if (filters.size > 0) {
        const filterString = [...filters.entries()]
            .flatMap((entry) => {
                const [key, value] = entry;
                if (typeof value === "string") return `${key}=${value}`;
                if (Array.isArray(value)) return `${key}=${(value as Array<string>).join("|")}`;
                return [];
            })
            .join("~");
        searchParams.set("filter", `${filterString}`);
    }

    if (sort) searchParams.set("sort", sort);
    if (page > 1) searchParams.set("page", `${page}`);
    if (pageSize !== defaultPageSize) searchParams.set("pageSize", `${pageSize}`);

    return searchParams;
};

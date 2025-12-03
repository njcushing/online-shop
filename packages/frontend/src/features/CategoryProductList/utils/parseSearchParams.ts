import { defaultSort, sortOptions } from "../components/CategoryProductsSort";
import { ICategoryProductListContext } from "..";

const isNumeric = (str: string): boolean => {
    if (typeof str !== "string") return false;
    return !Number.isNaN(str) && !Number.isNaN(parseFloat(str));
};

type Return = {
    filters: ICategoryProductListContext["filterSelections"];
    sort: ICategoryProductListContext["sortSelection"];
    page: number;
    pageSize: number;
};

export const parseSearchParams = (searchParams: URLSearchParams): Return => {
    const filters: Return["filters"] = new Map();
    let sort: Return["sort"] = null;
    let page: Return["page"] = 1;
    let pageSize: Return["pageSize"] = 24;

    searchParams.entries().forEach((param) => {
        const [key, value] = param;

        if (key === "filter") {
            const filterList = value.split("~");
            filterList.forEach((filter) => {
                const [filterName, filterValues] = filter.split("=");
                const filterValuesSplit = filterValues.split("|");
                if (filterValuesSplit.length === 1) filters.set(filterName, filterValuesSplit[0]);
                if (filterValuesSplit.length > 1) filters.set(filterName, filterValuesSplit);
            });
            return;
        }

        if (key === "sort") {
            if (sortOptions.find((opt) => opt.name === value)) {
                sort = value as (typeof sortOptions)[number]["name"];
            } else {
                sort = defaultSort;
            }
        }

        if (key === "page" && isNumeric(value)) {
            page = Number(value);
            return;
        }

        if (key === "pageSize" && isNumeric(value)) {
            pageSize = Number(value);
        }
    });

    return {
        filters,
        sort,
        page,
        pageSize,
    };
};

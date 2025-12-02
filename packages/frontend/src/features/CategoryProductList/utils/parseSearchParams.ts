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

export const parseSearchParams = (): Return => {
    const decoded = decodeURIComponent(window.location.search);
    const searchParams = new URLSearchParams(decoded);

    const filters = new Map<string, string>();
    let sort = null;
    let page = 1;
    let pageSize = 24;

    searchParams.entries().forEach((param) => {
        const [key, value] = param;

        if (key === "filter") {
            const filterList = value.split("~");
            filterList.forEach((filter) => {
                const [filterName, filterValues] = filter.split("=");
                const filterValuesSplit = filterValues.split("|");
                if (filterValuesSplit.length === 1) filters.set(filterName, filterValuesSplit[0]);
                if (filterValuesSplit.length > 1)
                    filters.set(filterName, filterValuesSplit.join(","));
            });
            return;
        }

        if (key === "sort") {
            sort = value;
            return;
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

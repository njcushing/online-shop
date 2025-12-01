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
    const filters = new Map<string, string>();
    let sort = null;
    let page = 1;
    let pageSize = 24;

    searchParams.entries().forEach((param) => {
        const [key, value] = param;

        if (key.length >= 3 && key.slice(0, 3) === "fq:") {
            const [, name] = key.split(":");
            filters.set(name, value);
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

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
                const [key, v] = entry;
                const { type, value } = v;

                switch (type) {
                    case "text": {
                        const valuesString = value.filter((s) => s.length).join("|");
                        if (valuesString.length > 0) return `${key}=${valuesString}`;
                        return [];
                    }
                    case "boolean":
                        return `${key}=${value ? "true" : "false"}`;
                    case "numeric": {
                        const valuesString = value.join("..");
                        if (valuesString.length > 0) return `${key}=${valuesString}`;
                        return [];
                    }
                    case "color": {
                        const valuesString = value.filter((s) => s.length).join("|");
                        if (valuesString.length > 0) return `${key}=${valuesString}`;
                        return [];
                    }
                    case "date": {
                        const valuesString = value.filter((s) => s.length).join("..");
                        if (valuesString.length > 0) return `${key}=${valuesString}`;
                        return [];
                    }
                    case "select":
                        if (value.length > 0) return `${key}=${value}`;
                        return [];
                    default:
                        return [];
                }
            })
            .join("~");
        searchParams.set("filter", `${filterString}`);
    }

    if (sort) searchParams.set("sort", sort);
    if (page > 1) searchParams.set("page", `${page}`);
    if (pageSize !== defaultPageSize) searchParams.set("pageSize", `${pageSize}`);

    return searchParams;
};

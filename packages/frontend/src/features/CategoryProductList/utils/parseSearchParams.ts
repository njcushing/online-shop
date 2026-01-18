import { ResponseBody as GetCategoryBySlugResponseDto } from "@/api/categories/[slug]/GET";
import { isNumeric } from "@/utils/isNumeric";
import { defaultPageSize, ICategoryProductListContext } from "..";
import { defaultSort, sortOptions } from "../components/CategoryProductsSort";

type Return = {
    filters: ICategoryProductListContext["filterSelections"];
    sort: ICategoryProductListContext["sortSelection"];
    page: number;
    pageSize: number;
};

export const parseSearchParams = (
    searchParams: URLSearchParams,
    categoryFilters: GetCategoryBySlugResponseDto["filters"],
): Return => {
    const filters: Return["filters"] = new Map();
    let sort: Return["sort"] = null;
    let page: Return["page"] = 1;
    let pageSize: Return["pageSize"] = defaultPageSize;

    searchParams.entries().forEach((param) => {
        const [key, value] = param;

        if (key === "filter") {
            const filterList = value.split("~");
            filterList.forEach((filter) => {
                const [filterCode, filterValues] = filter.split("=");
                const filterData = categoryFilters.find((cf) => cf.code === filterCode);

                let { type } = filterData ?? { type: "INVALID" };
                const { values } = filterData ?? { values: [] };
                if (filterCode.toLowerCase() === "rating") type = "select";
                if (filterCode.toLowerCase() === "price") type = "numeric";

                if (type === "INVALID") return;

                switch (type) {
                    case "text": {
                        const validFilterValues = filterValues
                            .split("|")
                            .filter((v) => values.find(({ code }) => code === v));
                        if (validFilterValues.length > 0) {
                            filters.set(filterCode, { type, value: validFilterValues });
                        }
                        break;
                    }
                    case "boolean":
                        filters.set(filterCode, { type, value: filterValues === "true" });
                        break;
                    case "numeric": {
                        const filterValuesSplit = filterValues.split("..");
                        if (filterValuesSplit.some((v) => !isNumeric(v))) break;
                        filters.set(filterCode, {
                            type,
                            value: [Number(filterValuesSplit[0]), Number(filterValuesSplit[1])],
                        });
                        break;
                    }
                    case "color": {
                        const validFilterValues = filterValues
                            .split("|")
                            .filter((v) => values.find(({ code }) => code === v));
                        if (validFilterValues.length > 0) {
                            filters.set(filterCode, { type, value: validFilterValues });
                        }
                        break;
                    }
                    case "date": {
                        const filterValuesSplit = filterValues.split("..");
                        if (filterValuesSplit.some((v) => Number.isNaN(Date.parse(v)))) break;
                        if (filterValuesSplit.length > 0) {
                            filters.set(filterCode, { type, value: filterValuesSplit });
                        }
                        break;
                    }
                    case "select":
                        if (values.find(({ code }) => code === filterValues)) {
                            filters.set(filterCode, { type, value: filterValues });
                        }
                        filters.set(filterCode, { type, value: filterValues });
                        break;
                    default:
                }
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

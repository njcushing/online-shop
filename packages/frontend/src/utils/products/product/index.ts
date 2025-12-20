import { loremIpsum } from "lorem-ipsum";
import { RecursivePartial } from "@/utils/types";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/products/[slug]/GET";
import { ResponseBody as GetReviewsByProductSlugResponseDto } from "@/api/products/[slug]/reviews/GET";
import { v4 as uuid } from "uuid";

export const extractRelatedAttributesOrdered = (
    product: GetProductBySlugResponseDto,
    selectedVariant: GetProductBySlugResponseDto["variants"][number],
): GetProductBySlugResponseDto["attributes"] => {
    const { attributes: allAttributes, variants } = product;
    const { attributes: selectedVariantAttributes } = selectedVariant;

    const attributeMap: Map<string, { index: number; codes: Set<string> }> = new Map();
    const attributes: GetProductBySlugResponseDto["attributes"] = [];

    const clonedVariants = structuredClone(variants);
    for (let i = 0; i < allAttributes.length; i++) {
        const ancestorAttributeName = i > 0 ? allAttributes[i - 1].name : null;
        const currentAttributeName = allAttributes[i].name;

        for (let j = clonedVariants.length - 1; j >= 0; j--) {
            const variant = clonedVariants[j];

            const variantAncestorAttribute = variant.attributes.find(
                (a) => a.type.name === ancestorAttributeName,
            );

            const variantAttribute = variant.attributes.find(
                (a) => a.type.name === currentAttributeName,
            );

            const selectedVariantAncestorAttribute = selectedVariantAttributes.find(
                (a) => a.type.name === ancestorAttributeName,
            );

            if (
                (i === 0 && variantAttribute !== undefined) ||
                (i > 0 &&
                    variantAncestorAttribute !== undefined &&
                    variantAttribute !== undefined &&
                    selectedVariantAncestorAttribute !== undefined &&
                    variantAncestorAttribute.type.name ===
                        selectedVariantAncestorAttribute.type.name)
            ) {
                if (!attributeMap.has(currentAttributeName)) {
                    attributeMap.set(currentAttributeName, {
                        index: attributes.length,
                        codes: new Set(),
                    });

                    attributes.push({ ...allAttributes[i], values: [] });
                }

                if (
                    !attributeMap.get(currentAttributeName)!.codes.has(variantAttribute.value.code)
                ) {
                    const { code } = variantAttribute.value;
                    const attributeValueData = allAttributes[i].values.find(
                        (v) => v.code === code,
                    )!;
                    attributeMap.get(currentAttributeName)!.codes.add(code);
                    attributes[attributeMap.get(currentAttributeName)!.index]!.values.push(
                        attributeValueData,
                    );
                }
            } else {
                clonedVariants.splice(j, 1);
            }
        }
    }

    attributes.sort((a, b) => a.position - b.position);
    attributes.map((att) => att.values.sort((a, b) => a.position - b.position));

    return attributes;
};

export const findVariantByAttributes = (
    product: GetProductBySlugResponseDto,
    attributes: GetProductBySlugResponseDto["variants"][number]["attributes"],
    exact: boolean = false,
): GetProductBySlugResponseDto["variants"][number] | null => {
    const { variants } = product;
    if (variants.length === 0) return null;

    let closestMatch: GetProductBySlugResponseDto["variants"][number] = variants[0];
    let closestMatchCount = 0;

    for (let i = 0; i < product.variants.length; i++) {
        const variant = product.variants[i];

        for (let j = 0; j < attributes.length; j++) {
            const { type, value } = attributes[j];
            const variantAttributeMatch = variant.attributes.find((a) => {
                return a.type.id === type.id && a.value.code === value.code;
            });
            if (variantAttributeMatch) {
                if (j > closestMatchCount) {
                    closestMatch = variant;
                    closestMatchCount = j;
                }
                break;
            }
            if (j === attributes.length - 1) return variant;
        }
    }

    return exact ? null : closestMatch;
};

export const findVariantByAttributeParams = (
    product: GetProductBySlugResponseDto,
    attributeParams: { [key: string]: string },
    exact: boolean = false,
): GetProductBySlugResponseDto["variants"][number] | null => {
    const { variants } = product;
    if (variants.length === 0) return null;

    const attributeParamsEntries = Object.entries(attributeParams);

    let closestMatch: GetProductBySlugResponseDto["variants"][number] = variants[0];
    let closestMatchCount = 0;

    for (let i = 0; i < product.variants.length; i++) {
        const variant = product.variants[i];
        let matches = 0;

        for (let j = 0; j < attributeParamsEntries.length; j++) {
            const [key, value] = attributeParamsEntries[j];
            const variantAttributeMatch = variant.attributes.find((a) => {
                return a.type.name === key && a.value.code === value;
            });
            if (variantAttributeMatch) matches += 1;
        }

        if (matches > closestMatchCount) {
            if (matches >= attributeParamsEntries.length) return variant;

            closestMatch = variant;
            closestMatchCount = matches;
        }
    }

    return exact ? null : closestMatch;
};

export const generateSkeletonProductReview = (): RecursivePartial<
    GetReviewsByProductSlugResponseDto["reviews"][number]
> => {
    return {
        title: "Review Title",
        description: "Review description",
        rating: Math.ceil(Math.random() * 5),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        variant: { name: "Variant Name", sku: "", attributes: [] },
    };
};

export const generateSkeletonProductVariant = (): RecursivePartial<
    GetProductBySlugResponseDto["variants"][number]
> => ({
    id: uuid(),
    name: "Variant Name",
    sku: uuid(),
    canSubscribe: Math.random() < 0.5,
    priceCurrent: 1000,
    priceBase: 1000,
    subscriptionDiscountPercentage: 0,
    stock: 1000,
    allowanceOverride: -1,
    active: true,
    releaseDate: new Date().toISOString(),
    attributes: [
        {
            type: { id: uuid(), name: "Size", title: "Choose a size" },
            value: { code: "LG", name: "Large" },
        },
    ],
    details: [
        { id: uuid(), name: "Detail 1", value: "Value" },
        { id: uuid(), name: "Detail 2", value: "Value" },
        { id: uuid(), name: "Detail 3", value: "Value" },
    ],
    images: [
        { id: uuid(), src: "a", alt: "", position: 0 },
        { id: uuid(), src: "b", alt: "", position: 1 },
        { id: uuid(), src: "c", alt: "", position: 2 },
        { id: uuid(), src: "d", alt: "", position: 3 },
        { id: uuid(), src: "e", alt: "", position: 4 },
    ],
});

export const generateSkeletonProduct = (): RecursivePartial<GetProductBySlugResponseDto> => {
    return {
        id: uuid(),
        name: "Product Name",
        description: `${loremIpsum({
            paragraphLowerBound: 3,
            paragraphUpperBound: 9,
            sentenceLowerBound: 16,
            sentenceUpperBound: 40,
        })}`,
        slug: uuid(),
        allowance: 100,
        tags: [],
        releaseDate: new Date().toISOString(),
        rating: {
            average: 5.0,
            total: 100,
            quantities: { 5: 90, 4: 6, 3: 2, 2: 1, 1: 1 },
        },
        attributes: [
            {
                position: 0,
                name: "Size",
                title: "Choose a size",
                type: "string",
                values: [
                    { position: 0, code: "AA", name: "Name AA", value: "Value AA" },
                    { position: 1, code: "AB", name: "Name AB", value: "Value AB" },
                    { position: 2, code: "AC", name: "Name AC", value: "Value AC" },
                    { position: 3, code: "AD", name: "Name AD", value: "Value AD" },
                    { position: 4, code: "AE", name: "Name AE", value: "Value AE" },
                    { position: 5, code: "AF", name: "Name AF", value: "Value AF" },
                    { position: 6, code: "AG", name: "Name AG", value: "Value AG" },
                    { position: 7, code: "AH", name: "Name AH", value: "Value AH" },
                    { position: 8, code: "AI", name: "Name AI", value: "Value AI" },
                    { position: 9, code: "AJ", name: "Name AJ", value: "Value AJ" },
                ],
            },
        ],
        collections: [
            {
                id: uuid(),
                name: "Collection 1",
                title: "Collection 1 Title",
                description: "Collection 1 description",
                slug: "Collection_1_slug",
                products: Array.from({ length: 2 }).map(() => ({
                    id: uuid(),
                    name: "Product Name",
                    slug: uuid(),
                    images: [
                        { id: uuid(), src: "a", alt: "", position: 0 },
                        { id: uuid(), src: "b", alt: "", position: 1 },
                        { id: uuid(), src: "c", alt: "", position: 2 },
                        { id: uuid(), src: "d", alt: "", position: 3 },
                        { id: uuid(), src: "e", alt: "", position: 4 },
                    ],
                })),
            },
        ],
        categories: [
            {
                id: uuid(),
                parentId: null,
                name: "Category",
                slug: uuid(),
                description: "Category description",
            },
        ],
        details: [
            { id: uuid(), name: "Product Detail 1", value: "Value" },
            { id: uuid(), name: "Product Detail 2", value: "Value" },
            { id: uuid(), name: "Product Detail 3", value: "Value" },
        ],
        images: [
            { id: uuid(), src: "a", alt: "", position: 0 },
            { id: uuid(), src: "b", alt: "", position: 1 },
            { id: uuid(), src: "c", alt: "", position: 2 },
            { id: uuid(), src: "d", alt: "", position: 3 },
            { id: uuid(), src: "e", alt: "", position: 4 },
        ],
        variants: Array.from({ length: 5 }).map(() => generateSkeletonProductVariant()),
    };
};

export const mockProducts: GetProductBySlugResponseDto[] = Array.from({ length: 10 }).map(() =>
    generateSkeletonProduct(),
) as GetProductBySlugResponseDto[];

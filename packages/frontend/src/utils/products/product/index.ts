import { loremIpsum } from "lorem-ipsum";
import { RecursivePartial } from "@/utils/types";
import { ResponseBody as GetProductBySlugResponseDto } from "@/api/product/[slug]/GET";
import { v4 as uuid } from "uuid";

type ExtractAttributesReturnType = {
    info: GetProductBySlugResponseDto["attributes"][number];
    values: GetProductBySlugResponseDto["variants"][number]["attributes"][number]["value"][];
}[];
export const extractAttributesOrdered = (
    product: GetProductBySlugResponseDto,
): ExtractAttributesReturnType => {
    const attributeMap: Map<string, { index: number; codes: Set<string> }> = new Map();
    const attributes: ExtractAttributesReturnType = [];

    const { attributes: attributeOrder, variants } = product;

    variants.forEach((variant) => {
        variant.attributes.forEach((attribute) => {
            const { type, value } = attribute;
            const { name } = type;

            if (!attributeMap.has(name)) {
                attributeMap.set(name, { index: attributes.length, codes: new Set() });

                attributes.push({
                    info: attributeOrder.find((a) => a.name === name)!,
                    values: [],
                });
            }

            if (!attributeMap.get(name)!.codes.has(value.code)) {
                attributeMap.get(name)!.codes.add(value.code);
                attributes[attributeMap.get(name)!.index]!.values.push(value);
            }
        });
    });

    attributes.sort((a, b) => a.info.position - b.info.position);
    attributes.map((att) => att.values.sort((a, b) => a.position - b.position));

    return attributes;
};

export const extractRelatedAttributesOrdered = (
    product: GetProductBySlugResponseDto,
    selectedVariant: GetProductBySlugResponseDto["variants"][number],
): ExtractAttributesReturnType => {
    const { attributes: attributeOrder, variants } = product;
    const { attributes: selectedVariantAttributes } = selectedVariant;

    const attributeMap: Map<string, { index: number; codes: Set<string> }> = new Map();
    const attributes: ExtractAttributesReturnType = [];

    const matchedVariants = structuredClone(variants);
    for (let i = 0; i < attributeOrder.length; i++) {
        const ancestorAttributeName = i > 0 ? attributeOrder[i - 1].name : null;
        const currentAttributeName = attributeOrder[i].name;

        for (let j = matchedVariants.length - 1; j >= 0; j--) {
            const variant = matchedVariants[j];

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

                    attributes.push({
                        info: attributeOrder.find((a) => a.name === currentAttributeName)!,
                        values: [],
                    });
                }

                if (
                    !attributeMap.get(currentAttributeName)!.codes.has(variantAttribute.value.code)
                ) {
                    attributeMap.get(currentAttributeName)!.codes.add(variantAttribute.value.code);
                    attributes[attributeMap.get(currentAttributeName)!.index]!.values.push(
                        variantAttribute.value,
                    );
                }
            } else {
                matchedVariants.splice(j, 1);
            }
        }
    }

    attributes.sort((a, b) => a.info.position - b.info.position);
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
    GetProductBySlugResponseDto["reviews"][number]
> => {
    return {
        id: uuid(),
        variantId: uuid(),
        title: "Review Title",
        description: "Review description",
        rating: Math.ceil(Math.random() * 5),
        createdAt: new Date().toISOString(),
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
        attributes: [{ name: "Size", title: "Choose a size", position: 0 }],
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
        reviews: Array.from({ length: 5 }).map(() => generateSkeletonProductReview()),
        variants: Array.from({ length: 5 }).map(() => generateSkeletonProductVariant()),
    };
};

export const mockProducts: GetProductBySlugResponseDto[] = Array.from({ length: 10 }).map(() =>
    generateSkeletonProduct(),
) as GetProductBySlugResponseDto[];

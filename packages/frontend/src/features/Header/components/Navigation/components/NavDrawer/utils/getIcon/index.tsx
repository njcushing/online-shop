import { CoffeeBean, Leaf, Gear, Gift, IconProps, SquaresFour } from "@phosphor-icons/react";

const iconProps: IconProps = {
    weight: "fill",
    size: 24,
};

export const getIcon = (categorySlug: string): JSX.Element | null => {
    switch (categorySlug) {
        case "coffee":
            return <CoffeeBean {...iconProps} />;
        case "tea":
            return <Leaf {...iconProps} />;
        case "equipment-and-accessories":
            return <Gear {...iconProps} />;
        case "gifts":
            return <Gift {...iconProps} />;
        case "samples":
            return <SquaresFour {...iconProps} />;
        default:
            return null;
    }
};

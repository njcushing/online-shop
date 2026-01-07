import { CoffeeBean, Leaf, Gear, Gift, IconProps, SquaresFour } from "@phosphor-icons/react";

const iconProps: IconProps = {
    weight: "fill",
    size: 24,
};

export const getIcon = (categoryName: string): JSX.Element | null => {
    switch (categoryName) {
        case "Coffee":
            return <CoffeeBean {...iconProps} />;
        case "Tea":
            return <Leaf {...iconProps} />;
        case "Equipment & Accessories":
            return <Gear {...iconProps} />;
        case "Gifts":
            return <Gift {...iconProps} />;
        case "Samples":
            return <SquaresFour {...iconProps} />;
        default:
            return null;
    }
};

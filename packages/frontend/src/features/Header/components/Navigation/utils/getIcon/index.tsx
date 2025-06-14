import { CoffeeBean, Leaf, Coffee, Gear, Gift, IconProps } from "@phosphor-icons/react";

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
        case "Equipment":
            return <Gear {...iconProps} />;
        case "Accessories":
            return <Coffee {...iconProps} />;
        case "Gifts & Subscriptions":
            return <Gift {...iconProps} />;
        default:
            return null;
    }
};

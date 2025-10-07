BEGIN;

WITH coffee AS (
    INSERT INTO categories (parent_id, name, slug, description)
    VALUES (null, 'Coffee', 'coffee', 'All coffee-related products.')
    RETURNING id
),
tea AS (
    INSERT INTO categories (parent_id, name, slug, description)
    VALUES (null, 'Tea', 'tea', 'A variety of teas from around the world.')
    RETURNING id
),
equipment AS (
    INSERT INTO categories (parent_id, name, slug, description)
    VALUES (null, 'Equipment', 'equipment', 'Everything you need to brew coffee & tea.')
    RETURNING id
),
accessories AS (
    INSERT INTO categories (parent_id, name, slug, description)
    VALUES (null, 'Accessories', 'accessories', 'Enhance your coffee and tea experience.')
    RETURNING id
),
gifts_subscriptions AS (
    INSERT INTO categories (parent_id, name, slug, description)
    VALUES (null, 'Gifts & Subscriptions', 'gifts-subscriptions', 'Great gifts for coffee and tea lovers.')
    RETURNING id
)
INSERT INTO categories (parent_id, name, slug, description) VALUES
    ((select id from coffee), 'Beans', 'beans', 'Whole coffee beans.'),
    ((select id from coffee), 'Ground', 'ground', 'Pre-ground coffee for convenience.'),
    ((select id from coffee), 'Instant & Pods', 'instant-and-pods', 'Whole coffee beans.'),
    ((select id from coffee), 'Cold Brew & Ready-to-Drink', 'cold-brew-ready', 'Pre-made cold brews.'),
    ((select id from tea), 'Loose Leaf', 'loose-leaf', 'High-quality loose tea leaves.'),
    ((select id from tea), 'Bags', 'bags', 'Convenient tea bags.'),
    ((select id from tea), 'Specialty & Powdered', 'specialty-and-powdered', 'Matcha and chai powders.'),
    ((select id from tea), 'Ready-to-Drink', 'ready-to-drink', 'Pre-bottled teas.'),
    ((select id from equipment), 'Brewing', 'brewing', 'Manual brewing devices.'),
    ((select id from equipment), 'Espresso Machines', 'espresso-machines', 'Machines for making espresso.'),
    ((select id from equipment), 'Grinders', 'grinders', 'For freshly ground coffee.'),
    ((select id from equipment), 'Scales & Timers', 'scales-timers', 'Precision tools for brewing.'),
    ((select id from equipment), 'Cold Brew Makers', 'cold-brew-makers', 'Specialized cold brew tools.'),
    ((select id from accessories), 'Mugs & Tumblers', 'mugs-tumblers', 'Drinkware for all beverages.'),
    ((select id from accessories), 'Filters & Maintenance', 'filters-maintenance', 'Reusable and disposable filters.'),
    ((select id from accessories), 'Frothers & Steamers', 'frothers-steamers', 'Tools for milk frothing.'),
    ((select id from gifts_subscriptions), 'Gift Sets & Sampler Packs', 'gift-sets-packs', 'Curated gift sets.'),
    ((select id from gifts_subscriptions), 'Coffee Subscription Boxes', 'subscription-boxes', 'Monthly coffee deliveries.'),
    ((select id from gifts_subscriptions), 'Gift Cards', 'gift-cards', 'Digital and physical gift cards.');

COMMIT;

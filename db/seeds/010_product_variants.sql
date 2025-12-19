BEGIN;

CREATE TEMP TABLE product_variants_csv (
    product_slug text,
    name text,
    sku text,
    can_subscribe boolean,
    price_current numeric(10,2),
    price_base numeric(10,2),
    subscription_discount_percentage numeric(10,4),
    stock int,
    allowance_override int,
    times_sold int,
    times_returned int,
    active boolean,
    release_date timestamptz
);

COPY product_variants_csv (
    product_slug,
    name,
    sku,
    can_subscribe,
    price_current,
    price_base,
    subscription_discount_percentage,
    stock,
    allowance_override,
    times_sold,
    times_returned,
    active,
    release_date
)
FROM '/db/seeds/data/product_variants.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO product_variants (
    product_id,
    name,
    sku,
    can_subscribe,
    price_current,
    price_base,
    subscription_discount_percentage,
    stock,
    allowance_override,
    times_sold,
    times_returned,
    active,
    release_date
)
SELECT
    p.id,
    pv.name,
    pv.sku,
    pv.can_subscribe,
    pv.price_current,
    pv.price_base,
    pv.subscription_discount_percentage,
    pv.stock,
    pv.allowance_override,
    pv.times_sold,
    pv.times_returned,
    pv.active,
    pv.release_date
FROM product_variants_csv pv
JOIN products p ON p.slug = pv.product_slug;

COMMIT;



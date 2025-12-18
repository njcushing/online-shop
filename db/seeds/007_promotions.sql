BEGIN;

CREATE TEMP TABLE promotions_csv (
    code text,
    name text,
    description text,
    promotion_type_name text,
    discount_value numeric(10,4),
    threshold_value numeric(10,2),
    start_date timestamptz,
    active boolean,
    usage_limit int
);

COPY promotions_csv (code, name, description, promotion_type_name, discount_value, threshold_value, start_date, active, usage_limit)
FROM '/db/seeds/data/promotions.csv'
WITH (FORMAT csv, HEADER true);

INSERT INTO promotions (code, name, description, promotion_type_id, discount_value, threshold_value, start_date, active, usage_limit)
SELECT p.code, p.name, p.description, pt.id, p.discount_value, p.threshold_value, p.start_date, p.active, p.usage_limit
FROM promotions_csv p
JOIN promotion_types pt ON pt.name = p.promotion_type_name;

COMMIT;

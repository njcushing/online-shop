-- migrate:up
CREATE OR REPLACE FUNCTION assert_valid_attribute_value(
    p_attribute_id uuid,
    p_value_text text,
    p_value_numeric numeric,
    p_value_boolean boolean,
    p_value_color char(7),
    p_value_date timestamptz,
    p_value_select text
)
RETURNS boolean AS $$
DECLARE
    v_type text;
BEGIN
    SELECT t.name INTO v_type
    FROM product_attributes pa
    JOIN product_attribute_value_types t
        ON pa.product_attribute_value_type_id = t.id
    WHERE pa.id = p_attribute_id;

    CASE v_type
        WHEN 'text' THEN
            RETURN p_value_text IS NOT NULL
               AND p_value_numeric IS NULL
               AND p_value_boolean IS NULL
               AND p_value_color IS NULL
               AND p_value_date IS NULL
               AND p_value_select IS NULL;

        WHEN 'numeric' THEN
            RETURN p_value_numeric IS NOT NULL
               AND p_value_text IS NULL
               AND p_value_boolean IS NULL
               AND p_value_color IS NULL
               AND p_value_date IS NULL
               AND p_value_select IS NULL;

        WHEN 'boolean' THEN
            RETURN p_value_boolean IS NOT NULL
               AND p_value_text IS NULL
               AND p_value_numeric IS NULL
               AND p_value_color IS NULL
               AND p_value_date IS NULL
               AND p_value_select IS NULL;

        WHEN 'color' THEN
            RETURN p_value_color IS NOT NULL
               AND p_value_text IS NULL
               AND p_value_numeric IS NULL
               AND p_value_boolean IS NULL
               AND p_value_date IS NULL
               AND p_value_select IS NULL;

        WHEN 'date' THEN
            RETURN p_value_date IS NOT NULL
               AND p_value_text IS NULL
               AND p_value_numeric IS NULL
               AND p_value_boolean IS NULL
               AND p_value_color IS NULL
               AND p_value_select IS NULL;

        WHEN 'select' THEN
            RETURN p_value_select IS NOT NULL
               AND p_value_text IS NULL
               AND p_value_numeric IS NULL
               AND p_value_boolean IS NULL
               AND p_value_color IS NULL
               AND p_value_date IS NULL;

        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE product_attribute_values (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    product_attribute_id uuid NOT NULL REFERENCES product_attributes(id) ON DELETE CASCADE,
    position int NOT NULL CHECK (position >= 0),
    code text NOT NULL,
    name text NOT NULL,
    value_text text,
    value_numeric numeric,
    value_boolean boolean,
    value_color varchar(7) CHECK (value_color IS NULL OR value_color ~* '^#[a-f0-9]{6}$'),
    value_date timestamptz,
    value_select text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    PRIMARY KEY (id, product_attribute_id),
    UNIQUE (id, product_attribute_id),
    UNIQUE (product_attribute_id, position),
    UNIQUE (product_attribute_id, code),
    CONSTRAINT product_attribute_values_type_check
        CHECK (assert_valid_attribute_value(
            product_attribute_id,
            value_text,
            value_numeric,
            value_boolean,
            value_color,
            value_date,
            value_select
        ))
);

CREATE INDEX idx_product_attribute_value_attribute_code ON product_attribute_values (product_attribute_id, code);
CREATE UNIQUE INDEX uq_attribute_value_text ON product_attribute_values (product_attribute_id, value_text) WHERE value_text IS NOT NULL;
CREATE UNIQUE INDEX uq_attribute_value_numeric ON product_attribute_values (product_attribute_id, value_numeric) WHERE value_numeric IS NOT NULL;
CREATE UNIQUE INDEX uq_attribute_value_boolean ON product_attribute_values (product_attribute_id, value_boolean) WHERE value_boolean IS NOT NULL;
CREATE UNIQUE INDEX uq_attribute_value_color ON product_attribute_values (product_attribute_id, value_color) WHERE value_color IS NOT NULL;
CREATE UNIQUE INDEX uq_attribute_value_date ON product_attribute_values (product_attribute_id, value_date) WHERE value_date IS NOT NULL;
CREATE UNIQUE INDEX uq_attribute_value_select ON product_attribute_values (product_attribute_id, value_select) WHERE value_select IS NOT NULL;

CREATE FUNCTION get_product_attribute_value_id(attribute_code text, value_code text)
RETURNS uuid AS $$
    SELECT pav.id
    FROM product_attribute_values pav
    JOIN product_attributes pa ON pav.product_attribute_id = pa.id
    WHERE pa.code = attribute_code
        AND pav.code = value_code
    LIMIT 1;
$$ LANGUAGE sql STABLE;

-- migrate:down
DROP FUNCTION IF EXISTS get_product_attribute_value_id();
DROP INDEX IF EXISTS uq_attribute_value_text;
DROP INDEX IF EXISTS uq_attribute_value_numeric;
DROP INDEX IF EXISTS uq_attribute_value_boolean;
DROP INDEX IF EXISTS uq_attribute_value_color;
DROP INDEX IF EXISTS uq_attribute_value_date;
DROP INDEX IF EXISTS uq_attribute_value_select;
DROP INDEX IF EXISTS idx_product_attribute_value_attribute_code;
DROP TABLE IF EXISTS product_attribute_values;
DROP FUNCTION IF EXISTS assert_valid_attribute_value();

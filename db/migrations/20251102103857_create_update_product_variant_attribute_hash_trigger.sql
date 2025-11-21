-- migrate:up
CREATE OR REPLACE FUNCTION update_product_variant_attribute_hash()
RETURNS trigger AS $$
DECLARE new_attribute_hash text;
BEGIN
    SELECT md5(string_agg(
        pva.product_attribute_id::text || ':' || pva.product_attribute_value_id,
        ',' ORDER BY pva.product_attribute_id
    ))
    INTO new_attribute_hash
    FROM product_variant_attributes pva
    WHERE pva.product_variant_id = NEW.product_variant_id;

    UPDATE product_variants
    SET attribute_hash = new_attribute_hash
    WHERE id = NEW.product_variant_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_product_variant_attribute_hash
    AFTER INSERT OR UPDATE OR DELETE ON product_variant_attributes
    FOR EACH ROW EXECUTE FUNCTION update_product_variant_attribute_hash();

-- migrate:down
DROP TRIGGER IF EXISTS trg_update_product_variant_attribute_hash ON product_variant_attributes;
DROP FUNCTION IF EXISTS update_product_variant_attribute_hash();

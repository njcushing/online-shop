-- migrate:up
CREATE OR REPLACE FUNCTION update_times_sold_or_returned()
RETURNS TRIGGER AS $$
DECLARE
    new_status text;
    old_status text;
BEGIN
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        SELECT ost.name INTO new_status
        FROM order_status_types ost
        JOIN orders o ON o.order_status_type_id = ost.id
        WHERE o.id = NEW.order_id;
    END IF;

    IF TG_OP IN ('UPDATE', 'DELETE') THEN
        SELECT ost.name INTO old_status
        FROM order_status_types ost
        JOIN orders o ON o.order_status_type_id = ost.id
        WHERE o.id = OLD.order_id;
    END IF;

    IF TG_OP = 'INSERT' THEN
        IF new_status <> 'cancelled' THEN
            UPDATE product_variants
            SET times_sold = times_sold + NEW.quantity
            WHERE id = NEW.variant_id;
        END IF;

        IF new_status = 'returned' THEN
            UPDATE product_variants
            SET times_returned = times_returned + NEW.quantity
            WHERE id = NEW.variant_id;
        END IF;

        RETURN NEW;
    END IF;

    IF TG_OP = 'UPDATE' THEN
        IF NEW.quantity <> OLD.quantity AND new_status <> 'cancelled' THEN
            UPDATE product_variants
            SET times_sold = times_sold + (NEW.quantity - OLD.quantity)
            WHERE id = NEW.variant_id;
        END IF;

        IF old_status <> 'cancelled' AND new_status = 'cancelled' THEN
            UPDATE product_variants
            SET times_sold = times_sold - OLD.quantity
            WHERE id = OLD.variant_id;
        END IF;

        IF old_status = 'cancelled' AND new_status <> 'cancelled' THEN
            UPDATE product_variants
            SET times_sold = times_sold + NEW.quantity
            WHERE id = NEW.variant_id;
        END IF;

        IF new_status <> 'returned' AND old_status = 'returned' THEN
            UPDATE product_variants
            SET times_returned = times_returned - OLD.quantity
            WHERE id = NEW.variant_id;
        END IF;

        IF new_status = 'returned' AND old_status <> 'returned' THEN
            UPDATE product_variants
            SET times_returned = times_returned + NEW.quantity
            WHERE id = NEW.variant_id;
        END IF;

        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' THEN
        IF old_status <> 'cancelled' THEN
            UPDATE product_variants
            SET times_sold = times_sold - OLD.quantity
            WHERE id = OLD.variant_id;
        END IF;

        IF old_status = 'returned' THEN
            UPDATE product_variants
            SET times_returned = times_returned - OLD.quantity
            WHERE id = OLD.variant_id;
        END IF;

        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_times_sold_or_returned
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_times_sold_or_returned();

-- migrate:down
DROP TRIGGER IF EXISTS trg_update_times_sold_or_returned ON order_items;
DROP FUNCTION IF EXISTS update_times_sold_or_returned();


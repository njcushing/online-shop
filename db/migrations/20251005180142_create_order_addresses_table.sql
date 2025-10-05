-- migrate:up
CREATE TABLE order_addresses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    address_type_id uuid NOT NULL REFERENCES address_types(id) ON DELETE RESTRICT,
    line1 text NOT NULL CHECK (char_length(line1) >= 1),
    line2 text,
    town_city text NOT NULL CHECK (char_length(town_city) >= 1),
    county text,
    postcode text NOT NULL CHECK (postcode ~ '^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$'),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (order_id, address_type_id)
);

-- migrate:down
DROP TABLE IF EXISTS order_addresses;

/**
 * This approach for storing addresses in the database is denormalised, but for good reason - if I
 * were to have an 'addresses' table referenced by both the 'user_addresses' table and
 * 'order_addresses' tables, and an address record was mutated (because a user should be able to
 * edit their addresses), this could corrupt the order history; older orders' addresses would now be
 * wrong. Addresses for orders must be immutable, and having this separate table for addresses
 * associated with orders seems better than having some sort of 'immutable' field set to 'true' for
 * addresses associated with orders in the 'addresses' table to prevent their mutation.
 *
 * Postcode RegEx from:
 * https://stackoverflow.com/questions/164979/regex-for-matching-uk-postcodes
 */

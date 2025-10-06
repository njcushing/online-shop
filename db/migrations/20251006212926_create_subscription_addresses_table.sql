-- migrate:up
CREATE TABLE subscription_addresses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    address_type_id uuid NOT NULL REFERENCES address_types(id) ON DELETE RESTRICT,
    line1 text NOT NULL CHECK (char_length(line1) >= 1),
    line2 text,
    town_city text NOT NULL CHECK (char_length(town_city) >= 1),
    county text,
    postcode text NOT NULL CHECK (postcode ~ '^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$'),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz,
    UNIQUE (subscription_id, address_type_id)
);

-- migrate:down
DROP TABLE IF EXISTS subscription_addresses;

/**
 * Postcode RegEx from:
 * https://stackoverflow.com/questions/164979/regex-for-matching-uk-postcodes
 */

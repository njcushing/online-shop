-- migrate:up
CREATE TABLE addresses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    line1 text NOT NULL CHECK (char_length(line1) >= 1),
    line2 text,
    town_city text NOT NULL CHECK (char_length(town_city) >= 1),
    county text,
    postcode text NOT NULL CHECK (
        postcode ~ '^([Gg][Ii][Rr]0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})$'
    ),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz
);

-- migrate:down
DROP TABLE IF EXISTS addresses;

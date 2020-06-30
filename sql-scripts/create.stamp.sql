CREATE TABLE IF NOT EXISTS stampbook (
    stamp_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    user_id INTEGER NOT NULL,
    park_id INTEGER NOT NULL,
    stamp_date TIMESTAMPTZ DEFAULT now() NOT NULL,
    comments TEXT
);
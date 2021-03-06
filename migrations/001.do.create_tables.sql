CREATE TABLE IF NOT EXISTS parks (
    states TEXT NOT NULL,
    url TEXT,
    image TEXT NOT NULL,
    parkCode TEXT NOT NULL,
    id INTEGER PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    fullName TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS stampbook (
    stamp_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    park_id INTEGER REFERENCES parks(id) NOT NULL,
    stamp_date TIMESTAMPTZ DEFAULT now() NOT NULL,

);

CREATE TABLE IF NOT EXISTS bucketlist (
    bucketlist_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    park_id INTEGER REFERENCES parks(id) NOT NULL,
    
);
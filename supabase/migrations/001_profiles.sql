CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    bio TEXT NOT NULL DEFAULT '',
    avatar_url TEXT,
    account_type TEXT NOT NULL DEFAULT 'personal'
        CHECK (account_type IN ('personal', 'creator')),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT username_length
        CHECK (char_length(username) BETWEEN 3 AND 30),

    CONSTRAINT display_name_length
        CHECK (char_length(display_name) BETWEEN 1 AND 60),

    CONSTRAINT bio_length
        CHECK (char_length(bio) <= 500)
);

CREATE INDEX IF NOT EXISTS profiles_username_idx
    ON public.profiles (username);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
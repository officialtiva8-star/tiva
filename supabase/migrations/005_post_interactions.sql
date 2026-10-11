CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    post_id UUID NOT NULL
        REFERENCES public.posts(id) ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_post_like
        UNIQUE (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    post_id UUID NOT NULL
        REFERENCES public.posts(id) ON DELETE CASCADE,

    author_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,

    content TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT comment_content_length
        CHECK (
            char_length(trim(content)) BETWEEN 1 AND 2000
        )
);

CREATE TABLE IF NOT EXISTS public.post_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    post_id UUID NOT NULL
        REFERENCES public.posts(id) ON DELETE CASCADE,

    user_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_saved_post
        UNIQUE (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS post_comments_post_created_idx
    ON public.post_comments (post_id, created_at DESC);

CREATE INDEX IF NOT EXISTS post_likes_post_idx
    ON public.post_likes (post_id);

CREATE INDEX IF NOT EXISTS post_saves_user_idx
    ON public.post_saves (user_id);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_saves ENABLE ROW LEVEL SECURITY;
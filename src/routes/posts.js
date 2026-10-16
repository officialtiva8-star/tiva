import { Router } from "express";
import { z } from "zod";

import { requireAuth } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";

const router = Router();

const createPostSchema = z.object({
content: z.string().trim().min(1).max(5000),
audience: z.enum([
"public",
"followers",
"private"
]).default("public")
}).strict();

const ALLOWED_AUDIENCES = [
"public",
"followers",
"private"
];

router.get("/", requireAuth, async (req, res, next) => {
try {
const parsedLimit = Number.parseInt(
req.query.limit || "20",
10
);

const limit = Math.min(
  Math.max(
    Number.isFinite(parsedLimit) ? parsedLimit : 20,
    1
  ),
  50
);

/*
 * Fail closed: show public posts and the current
 * user's own posts. Follower-only visibility requires
 * a verified follower relationship implementation.
 */
const { data: posts, error } = await supabaseAdmin
  .from("posts")
  .select(`
    id,
    user_id,
    content,
    audience,
    created_at,
    profiles (
      display_name,
      username,
      avatar_url
    )
  `)
  .or(
    `audience.eq.public,user_id.eq.${req.user.id}`
  )
  .order("created_at", {
    ascending: false
  })
  .limit(limit);

if (error) {
  throw error;
}

return res.status(200).json({
  posts: posts || []
});

} catch (error) {
next(error);
}
});

router.post("/", requireAuth, async (req, res, next) => {
try {
const parsed = createPostSchema.safeParse(req.body);

if (!parsed.success) {
  return res.status(400).json({
    error: "Enter post content and choose a valid audience."
  });
}

const { content, audience } = parsed.data;

if (!ALLOWED_AUDIENCES.includes(audience)) {
  return res.status(400).json({
    error: "Invalid post audience."
  });
}

/*
 * Do not allow a user to publish a post on behalf
 * of another account. The owner comes from the
 * verified authentication middleware.
 */
const { data: post, error } = await supabaseAdmin
  .from("posts")
  .insert({
    user_id: req.user.id,
    content,
    audience
  })
  .select(`
    id,
    user_id,
    content,
    audience,
    created_at
  `)
  .single();

if (error) {
  throw error;
}

return res.status(201).json({
  message: "Post published successfully.",
  post
});

} catch (error) {
next(error);
}
});

export default router;
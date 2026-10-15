import { Router } from "express";

import { requireAuth } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const parsedLimit = Number.parseInt(
      req.query.limit || "20",
      10
    );

    const limit = Math.min(
      Math.max(Number.isFinite(parsedLimit) ? parsedLimit : 20, 1),
      50
    );

    const { data: posts, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .order("created_at", {
        ascending: false
      })
      .limit(limit);

    if (error) {
      throw error;
    }

    /*
      This is only a development foundation.

      DO NOT expose this endpoint publicly until server-side
      audience filtering, friendship checks, blocking, and
      post visibility rules have been implemented.

      Selecting all posts is not sufficient for TIVA's
      privacy requirements.
    */

    return res.status(200).json({
      posts: posts || [],
      warning: "Post privacy enforcement is not complete."
    });
  } catch (error) {
    next(error);
  }
});

export default router;
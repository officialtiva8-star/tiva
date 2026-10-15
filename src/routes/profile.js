import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";

const router = Router();

router.get("/:username", requireAuth, async (req, res, next) => {
  try {
    const username = String(req.params.username || "")
      .trim()
      .replace(/^@/, "");

    if (!/^[a-zA-Z0-9_.]{3,30}$/.test(username)) {
      return res.status(400).json({
        error: "Please provide a valid username."
      });
    }

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select(`
        id,
        username,
        display_name,
        avatar_url,
        country,
        bio,
        created_at
      `)
      .eq("username", username)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found."
      });
    }

    return res.status(200).json({
      profile
    });
  } catch (error) {
    next(error);
  }
});

export default router;
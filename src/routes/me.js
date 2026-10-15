import { Router } from "express";

import {
  requireAuth
} from "../middleware/auth.js";

import {
  supabaseAdmin
} from "../lib/supabase.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      data: profile,
      error: profileError
    } = await supabaseAdmin
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
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    const {
      data: wallet,
      error: walletError
    } = await supabaseAdmin
      .from("wallets")
      .select(`
        user_id,
        coin_balance,
        creator_earnings,
        updated_at
      `)
      .eq("user_id", userId)
      .maybeSingle();

    if (walletError) {
      throw walletError;
    }

    return res.status(200).json({
      user: {
        id: req.user.id,
        email: req.user.email || null,
        phone: req.user.phone || null
      },

      profile: profile || null,

      wallet: wallet || null
    });
  } catch (error) {
    next(error);
  }
});

export default router;
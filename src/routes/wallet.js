import { Router } from "express";
import { z } from "zod";

import { requireAuth } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";

const router = Router();

const COIN_PRICE_USD_PER_COIN = 0.025;

function getRequiredLevel(coins) {
  if (coins >= 100000) {
    return 20;
  }

  if (coins >= 20000) {
    return 15;
  }

  return 0;
}

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { data: wallet, error } = await supabaseAdmin
      .from("wallets")
      .select(`
        user_id,
        coin_balance,
        creator_earnings,
        updated_at
      `)
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!wallet) {
      return res.status(409).json({
        error: "Your wallet is being prepared. Please try again."
      });
    }

    return res.status(200).json({
      wallet,
      currency: "USD",
      coinPricing: {
        coins: 100,
        price: 2.5,
        currency: "USD"
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/packages",
  requireAuth,
  async (req, res) => {
    const packages = [
      100,
      250,
      500,
      1000,
      2500,
      5000,
      10000,
      20000,
      50000,
      100000,
      250000,
      500000,
      1000000
    ].map((coins) => ({
      coins,
      priceUsd: Number(
        (coins * COIN_PRICE_USD_PER_COIN).toFixed(2)
      ),
      requiredLevel: getRequiredLevel(coins)
    }));

    return res.status(200).json({
      currency: "USD",
      packages
    });
  }
);

const purchaseSchema = z.object({
  packageCoins: z.number()
    .int()
    .positive()
    .max(1000000)
});

router.post(
  "/purchase-intent",
  requireAuth,
  async (req, res) => {
    const parsed = purchaseSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Select a valid coin package."
      });
    }

    const coins = parsed.data.packageCoins;

    const allowedPackages = [
      100,
      250,
      500,
      1000,
      2500,
      5000,
      10000,
      20000,
      50000,
      100000,
      250000,
      500000,
      1000000
    ];

    if (!allowedPackages.includes(coins)) {
      return res.status(400).json({
        error: "This coin package is not available."
      });
    }

    if (process.env.PAYMENTS_ENABLED !== "true") {
      return res.status(503).json({
        error: "Coin purchases are not enabled yet."
      });
    }

    /*
      IMPORTANT:
      This endpoint does not create a payment session or credit coins.

      Before enabling real payments, implement:
      1. Fetching the user's actual level from the database.
      2. Enforcing the package-level restrictions on the server.
      3. Creating a checkout session with the chosen payment provider.
      4. Verifying signed provider webhooks.
      5. Recording each payment with a unique reference.
      6. Crediting coins atomically and idempotently.

      Never trust a price, level, payment status, or balance
      supplied by the browser.
    */

    return res.status(501).json({
      error: "Payment provider integration is not implemented yet."
    });
  }
);

router.get(
  "/transactions",
  requireAuth,
  async (req, res) => {
    /*
      Transaction history will use a dedicated transaction ledger.
      Do not guess transaction columns or expose other users' records.
    */

    return res.status(200).json({
      transactions: [],
      message: "Transaction history is not configured yet."
    });
  }
);

export default router;
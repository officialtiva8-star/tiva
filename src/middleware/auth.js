import {
  supabasePublic
} from "../lib/supabase.js";

export async function requireAuth(
  req,
  res,
  next
) {
  try {
    const authorization =
      req.headers.authorization || "";

    const match = authorization.match(
      /^Bearer\s+(.+)$/i
    );

    if (!match) {
      return res.status(401).json({
        error: "Please sign in to continue."
      });
    }

    const accessToken = match[1];

    const {
      data,
      error
    } = await supabasePublic.auth.getUser(
      accessToken
    );

    if (error || !data?.user) {
      return res.status(401).json({
        error: "Your session is invalid or expired."
      });
    }

    req.user = data.user;

    next();
  } catch (error) {
    next(error);
  }
}
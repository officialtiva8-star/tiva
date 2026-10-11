import { getSupabase } from "../config/supabase.js";

export async function findFriendship(userId, friendId) {
  if (!userId || !friendId) {
    throw new Error("Both user IDs are required.");
  }

  if (userId === friendId) {
    return null;
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("friendships")
    .select(
      "id, requester_id, addressee_id, status, created_at, updated_at"
    )
    .or(
      `and(requester_id.eq.${userId},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${userId})`
    )
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to retrieve friendship: ${error.message}`);
  }

  return data;
}
import { API_URL } from "@/constants";
import { Author } from "@/types/neynar";

export async function getFcUsers(fids: Array<number>): Promise<{
  next: { cursor: string | null };
  users: Array<Author>;
}> {
  const uniqueFids = Array.from(new Set(fids));
  const fidsParam = uniqueFids.join(",");
  const response = await fetch(
    `${API_URL}/neynar/v2/farcaster/user/bulk?fids=${fidsParam}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch Farcaster users: ${response.statusText}`);
  }
  return await response.json();
}

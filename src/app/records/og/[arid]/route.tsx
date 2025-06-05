import { NextRequest } from "next/server";
import { getOgResponse } from "@/components/posts/unlock-overlay-og";
import { API_URL } from "@/constants";
import { Token } from "@/types";
import { Author } from "@/types/neynar";
import { EncryptedRecord } from "@/types/encrypted-record";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ arid: string }> }
) {
  const { arid } = await params;
  const res = await fetch(`${API_URL}/encrypted-records/infos/${arid}`);
  const data = await res.json();
  const { tokens, user, record } = data as {
    tokens: Token[];
    user: Author;
    record: EncryptedRecord;
  };
  const token = tokens?.[0];
  return getOgResponse({
    contentType: record.type,
    creatorToken: token.token_address,
    requiredAmount: 10000,
    creatorName: user?.display_name || "",
  });
}

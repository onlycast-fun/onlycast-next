import { RecordInfoCard } from "@/components/posts/record-info-card";
import { API_URL, ONLYCAST_HOST } from "@/constants";
import { Token } from "@/types";
import { EncryptedRecord } from "@/types/encrypted-record";
import { User } from "@privy-io/react-auth";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ arid: string }>;
}): Promise<Metadata> {
  const { arid } = await params;
  const imageUrl = `${ONLYCAST_HOST}/records/og/${arid}`;
  const title = "Go to onlycast.fun to unlock";
  const description = "Go to onlycast.fun to unlock";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "image",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function EncryptedItemPage({
  params,
}: {
  params: Promise<{ arid: string }>;
}) {
  const { arid } = await params;
  const res = await fetch(`${API_URL}/encrypted-records/infos/${arid}`);
  const data = await res.json();
  const { tokens, user, record } = data as {
    tokens: Token[];
    user: User;
    record: EncryptedRecord;
  };
  const token = tokens[0];
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <RecordInfoCard author={user} token={token} record={record} />
    </div>
  );
}

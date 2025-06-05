import { EncryptedImage } from "@/components/posts/encrypted-image";
import { EncryptedText } from "@/components/posts/encrypted-text";
import { API_URL, ONLYCAST_HOST } from "@/constants";
import { Token } from "@/types";
import { EncryptedRecord, RecordType } from "@/types/encrypted-record";
import { Author } from "@/types/neynar";

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

export default async function EncryptedTextPage({
  params,
}: {
  params: Promise<{ arid: string }>;
}) {
  const { arid } = await params;
  const res = await fetch(`${API_URL}/encrypted-records/infos/${arid}`);
  const data = await res.json();
  const { tokens, user, record } = data as {
    tokens: Token[];
    user: Author;
    record: EncryptedRecord;
  };
  if (record.type === RecordType.text) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <EncryptedText arid={arid} creatorToken={tokens[0]} />
      </div>
    );
  }
  if (record.type === RecordType.image) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <EncryptedImage
          className="w-full min-h-48 md:h-64 mb-4"
          arid={arid}
          creatorToken={tokens[0]}
        />
      </div>
    );
  }
  if (record.type === RecordType.mixed) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <EncryptedImage
          className="w-full min-h-48 md:h-64 mb-4"
          arid={arid}
          creatorToken={tokens[0]}
        />
      </div>
    );
  }
}

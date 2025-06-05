import { EncryptedText } from "@/components/posts/encrypted-text";
import { ONLYCAST_HOST } from "@/constants";

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
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <EncryptedText arid={arid} />
    </div>
  );
}

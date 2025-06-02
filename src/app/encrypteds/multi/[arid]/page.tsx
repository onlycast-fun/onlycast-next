import { EncryptedMultiContent } from "@/components/posts/encrypted-multi-content";
import { ONLYCAST_HOST } from "@/constants";
import { getEncryptedMultiContentPageLink } from "@/lib/encrypted-record";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ arid: string }>;
}): Promise<Metadata> {
  const { arid } = await params;
  const imageUrl = `${ONLYCAST_HOST}/encrypteds/multi/${arid}/og-image`;
  const title = "Encrypted Content";
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
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <EncryptedMultiContent
        visitLink={getEncryptedMultiContentPageLink(arid)}
      />
    </div>
  );
}

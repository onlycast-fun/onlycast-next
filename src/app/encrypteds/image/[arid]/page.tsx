import { EncryptedImage } from "@/components/posts/encrypted-image";
import { ONLYCAST_HOST } from "@/constants";
import { getEncryptedImagePageLink } from "@/lib/encrypted-record";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { arid: string };
}): Promise<Metadata> {
  const imageUrl = `${ONLYCAST_HOST}/encrypteds/image/${params.arid}/og-image`;
  const title = "Encrypted Image";
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

export default async function EncryptedImagePage({
  params,
}: {
  params: Promise<{ arid: string }>;
}) {
  const { arid } = await params;
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <EncryptedImage visitLink={getEncryptedImagePageLink(arid)} />
    </div>
  );
}

import { EncryptedImage } from "@/components/posts/encrypted-image";
import { getEncryptedImagePageLink } from "@/lib/encrypted-record";

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

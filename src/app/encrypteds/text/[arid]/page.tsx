import { EncryptedImage } from "@/components/posts/encrypted-image";
import { getEncryptedTextPageLink } from "@/lib/encrypted-record";

export default async function EncryptedTextPage({
  params,
}: {
  params: Promise<{ arid: string }>;
}) {
  const { arid } = await params;
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <EncryptedImage visitLink={getEncryptedTextPageLink(arid)} />
    </div>
  );
}

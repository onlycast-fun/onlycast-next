import { EncryptedImage } from "@/components/posts/encrypted-image";
import { getEncryptedTextPageLink } from "@/lib/encrypted-record";

export default function EncryptedTextPage({
  params,
}: {
  params: { arid: string };
}) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <EncryptedImage visitLink={getEncryptedTextPageLink(params.arid)} />
    </div>
  );
}

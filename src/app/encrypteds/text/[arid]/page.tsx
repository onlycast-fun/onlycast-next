import { EncryptedText } from "@/components/posts/encrypted-text";
import { getEncryptedTextPageLink } from "@/lib/encrypted-record";

export default async function EncryptedTextPage({
  params,
}: {
  params: Promise<{ arid: string }>;
}) {
  const { arid } = await params;
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <EncryptedText visitLink={getEncryptedTextPageLink(arid)} />
    </div>
  );
}

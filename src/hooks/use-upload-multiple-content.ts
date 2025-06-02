import { usePrivy } from "@privy-io/react-auth";
import { useRequestSDK } from "@/providers/request-sdk-provider";
import { useCallback, useState } from "react";
import {
  getEncryptedMultiContentPageLink,
  getEncryptedTextPageLink,
} from "@/lib/encrypted-record";
import { RecordType, UnencryptedJson } from "@/types/encrypted-record";

export function useUploadMultipleContent() {
  const { sdk } = useRequestSDK();
  const { user } = usePrivy();
  const userId = user?.id;

  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    async (jsonContent: UnencryptedJson) => {
      if (!jsonContent) throw new Error("No JSON provided");
      try {
        setUploading(true);

        // 3. 上传到Arweave
        const uploadRes = await sdk.request<{
          everHash?: string;
          itemId: string;
          arUrl: string;
          arseedUrl: string;
        }>(`/ar-upload/json`, {
          method: "POST",
          body: JSON.stringify(jsonContent),
        });
        const { data } = uploadRes;
        if (!data) {
          throw new Error("Failed to upload JSON");
        }

        // 4. 记录上传日志
        const logRes = await sdk.request(`/encrypted-records`, {
          method: "POST",
          body: JSON.stringify({
            ar_id: data.itemId,
            type: RecordType.unencrypted_json,
          }),
        });
        const { data: logData } = logRes;
        if (!logData) {
          throw new Error("Failed to log upload");
        }
        const arId = uploadRes.data.itemId;
        return {
          arId,
          pageLink: getEncryptedMultiContentPageLink(arId),
        };
      } catch (error) {
        console.error("Text upload failed:", error);
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [sdk]
  );

  return { upload, uploading };
}

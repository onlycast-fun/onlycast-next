import { FrontendCrypto } from "@/lib/crypto";
import { useRequestSDK } from "@/providers/request-sdk-provider";
import { useCallback, useState } from "react";
import { RecordType } from "@/types/encrypted-record";
import { getEncryptedRecordPageLink } from "@/lib/encrypted-record";

export function useUploadEncryptedText() {
  const { sdk } = useRequestSDK();

  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    async (text: string, description?: string) => {
      if (!text) throw new Error("No text provided");
      try {
        setUploading(true);
        const res = await sdk.getEncryptKeys();
        if (!res.data) {
          throw new Error("Failed to get encryption keys");
        }
        const { aesKey, iv, salt } = await FrontendCrypto.formatkeys(res.data);
        console.log("Encryption keys:", res.data);
        if (!aesKey || !iv || !salt) {
          throw new Error("Encryption keys are missing");
        }

        // 1. 执行增强加密
        const { encrypted } = await FrontendCrypto.encryptText(text, {
          aesKey: aesKey,
          iv: iv,
        });

        // 3. 上传到Arweave
        const uploadRes = await sdk.request<{
          everHash?: string;
          itemId: string;
          arUrl: string;
          arseedUrl: string;
        }>(`/ar-upload/text`, {
          method: "POST",
          body: JSON.stringify({
            text: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
          }),
        });
        const { data } = uploadRes;
        if (!data) {
          throw new Error("Failed to upload text");
        }

        // 4. 记录上传日志
        const logRes = await sdk.request(`/encrypted-records`, {
          method: "POST",
          body: JSON.stringify({
            ar_id: data.itemId,
            salt: btoa(String.fromCharCode(...salt)),
            iv: btoa(String.fromCharCode(...iv)),
            type: RecordType.text,
            description: description || "",
          }),
        });
        const { data: logData } = logRes;
        if (!logData) {
          throw new Error("Failed to log upload");
        }
        const arId = uploadRes.data.itemId;
        return {
          arId,
          pageLink: getEncryptedRecordPageLink(arId, RecordType.text),
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

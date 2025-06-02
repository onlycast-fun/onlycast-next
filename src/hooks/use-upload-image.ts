import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { FrontendCrypto } from "@/lib/crypto";
import { useRequestSDK } from "@/providers/request-sdk-provider";
import { API_URL } from "@/constants";
import { useCallback, useState } from "react";
import { getEncryptedImagePageLink } from "@/lib/encrypted-record";
import { RecordType } from "@/types/encrypted-record";

export function useUploadEncryptedImage() {
  const { sdk } = useRequestSDK();
  const { user } = usePrivy();
  const userId = user?.id;

  const [uploading, setUploading] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      if (!file) throw new Error("No file provided");
      try {
        setUploading(true);

        // 1. 执行增强加密
        const { encrypted, salt, iv } = await FrontendCrypto.encryptFile(
          file,
          userId
        );

        // 2. 构造FormData
        const formData = new FormData();
        formData.append("file", new Blob([encrypted]), file.name);

        // 3. 上传到Arweave
        const uploadRes = await sdk.request<{
          everHash?: string;
          itemId: string;
          arUrl: string;
          arseedUrl: string;
        }>(`/ar-upload/image`, {
          method: "POST",
          body: formData,
          isFormData: true,
        });
        const { data } = uploadRes;
        if (!data) {
          throw new Error("Failed to upload image");
        }

        // 4. 记录上传日志
        const logRes = await sdk.request(`/encrypted-records`, {
          method: "POST",
          body: JSON.stringify({
            ar_id: data.itemId,
            salt: btoa(String.fromCharCode(...salt)),
            iv: btoa(String.fromCharCode(...iv)),
            type: RecordType.image,
          }),
        });
        const { data: logData } = logRes;
        if (!logData) {
          throw new Error("Failed to log upload");
        }
        const arId = uploadRes.data.itemId;
        return {
          arId,
          pageLink: getEncryptedImagePageLink(arId),
        };
      } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [sdk, userId]
  );

  return { upload, uploading };
}

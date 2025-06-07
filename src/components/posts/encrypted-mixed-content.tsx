"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { Token } from "@/types";
import {
  getDecryptApiWithArid,
  getDecryptionMixedContentApiWithArid,
} from "@/lib/encrypted-record";
import { useUserInfo } from "@/providers/userinfo-provider";
import { UnlockOverlay } from "./unlock-overlay";
import { RecordType } from "@/types/encrypted-record";
import { getUserPrimaryEthAddress } from "@/lib/farcaster/user";
import { UnlockText } from "./encrypted-text";
import { UnlockedImage } from "./encrypted-image";

interface EncryptedMixedContentProps {
  arid: string;
  alt?: string;
  creatorToken?: Token;
  className?: string;
}

export function EncryptedMixedContent({
  arid,
  alt,
  creatorToken,
  className,
}: EncryptedMixedContentProps) {
  const [text, setText] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { authenticated, login } = usePrivy();
  const { fcUser } = useUserInfo();
  const fcWalletAddress = getUserPrimaryEthAddress(fcUser!);

  const handleUnlock = async () => {
    if (!authenticated) {
      toast.error("You must be logged in to unlock this text");
      login();
      return;
    }
    if (!fcWalletAddress) {
      toast.error("Please set the verified wallet address in Farcaster");
      return;
    }

    setIsLoading(true);

    try {
      const token = await getAccessToken();
      const api = getDecryptionMixedContentApiWithArid(arid);
      const response = await fetch(api, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        toast.error("Failed to fetch content info");
        setIsLoading(false);
        return;
      }

      const jsonContent = await response.json();
      const { text_ar_id, image_ar_id } = jsonContent || {};

      const textPromise = text_ar_id
        ? fetch(getDecryptApiWithArid(text_ar_id), {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then(async (res) => {
            if (!res.ok) return null;
            return await res.text();
          })
        : Promise.resolve(null);

      const imagePromise = image_ar_id
        ? fetch(getDecryptApiWithArid(image_ar_id), {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then(async (res) => {
            if (!res.ok) return null;
            return await res.blob();
          })
        : Promise.resolve(null);

      const [decryptedText, imageBlob] = await Promise.all([
        textPromise,
        imagePromise,
      ]);

      if (!decryptedText && !imageBlob) {
        toast.error("Failed to decrypt any content");
        setIsLoading(false);
        return;
      }

      if (decryptedText) setText(decryptedText);
      if (imageBlob) setImgUrl(URL.createObjectURL(imageBlob));

      setIsUnlocked(true);
    } catch (error) {
      toast.error("Verification failed, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UnlockOverlay
      creatorToken={creatorToken?.symbol || ""}
      requiredAmount={10000}
      contentType={RecordType.mixed}
      isUnlocked={isUnlocked}
      isLoading={isLoading}
      onUnlockClick={handleUnlock}
    >
      <div className={cn("w-full min-h-48 md:min-h-64 flex flex-col gap-4")}>
        {!!text && <UnlockText text={text} />}

        {!!imgUrl && <UnlockedImage src={imgUrl} />}
      </div>
    </UnlockOverlay>
  );
}

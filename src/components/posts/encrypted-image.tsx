"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { Token } from "@/types";
import { useUserInfo } from "@/providers/userinfo-provider";
import { UnlockOverlay } from "./unlock-overlay";
import { RecordType } from "@/types/encrypted-record";
import { getDecryptApiWithArid } from "@/lib/encrypted-record";
import { getUserPrimaryEthAddress } from "@/lib/farcaster/user";

interface EncryptedImageProps {
  arid: string;
  creatorToken?: Token;
  className?: string;
}

export function EncryptedImage({
  arid,
  creatorToken,
  className,
}: EncryptedImageProps) {
  const [imgUrl, setImgUrl] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { authenticated, login } = usePrivy();
  const { fcUser } = useUserInfo();
  const fcWalletAddress = getUserPrimaryEthAddress(fcUser!);

  const api = getDecryptApiWithArid(arid);
  const handleUnlock = async () => {
    if (!authenticated) {
      toast.error("You must be logged in to unlock this image");
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
      const response = await fetch(api, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        setImgUrl(URL.createObjectURL(blob));
        setIsUnlocked(true);
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to unlock image");
      }
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
      contentType={RecordType.image}
      isUnlocked={isUnlocked}
      isLoading={isLoading}
      onUnlockClick={handleUnlock}
    >
      <div className={cn("relative overflow-hidden rounded-lg", className)}>
        <img
          src={imgUrl}
          className={cn(
            "w-full h-full object-cover transition-all duration-300",
            !isUnlocked && "blur-[10px]"
          )}
        />
      </div>
    </UnlockOverlay>
  );
}

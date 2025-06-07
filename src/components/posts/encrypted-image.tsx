"use client";

import { useState } from "react";
import { Expand, Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { Token } from "@/types";
import { useUserInfo } from "@/providers/userinfo-provider";
import { UnlockOverlay } from "./unlock-overlay";
import { RecordType } from "@/types/encrypted-record";
import { getDecryptApiWithArid } from "@/lib/encrypted-record";
import { getUserPrimaryEthAddress } from "@/lib/farcaster/user";
import { ImageLightbox } from "./image-lightbox";
import { Button } from "../ui/button";

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
      <div className={"w-full min-h-48 md:min-h-64 "}>
        {isUnlocked && <UnlockedImage src={imgUrl} />}
      </div>
    </UnlockOverlay>
  );
}

export function UnlockedImage({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      {src && (
        <img
          src={src}
          className={cn(
            "w-full h-full object-cover transition-all duration-300"
          )}
        />
      )}

      <div className="w-full h-full absolute top-0 right-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/20">
        <Button
          variant="secondary"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(true);
          }}
          className="bg-black/50 hover:bg-black/70 text-white border-white/20 backdrop-blur-sm"
        >
          <Expand className="w-4 h-4" />
        </Button>
      </div>
      <ImageLightbox
        src={src}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}

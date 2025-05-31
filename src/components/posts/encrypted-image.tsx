"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { Token } from "@/types";

interface EncryptedImageProps {
  visitLink: string;
  creatorToken?: Token;
  className?: string;
}

export function EncryptedImage({
  visitLink,
  creatorToken,
  className,
}: EncryptedImageProps) {
  const [imgUrl, setImgUrl] = useState<string>(visitLink);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { authenticated, login, user, linkWallet } = usePrivy();
  const walletAddress = user?.wallet?.address || "";

  const handleUnlock = async () => {
    if (!authenticated) {
      toast.error("You must be logged in to unlock this image");
      login();
      return;
    }
    if (!walletAddress) {
      toast.error("Please connect a wallet that holds the $TEST tokens");
      linkWallet();
      return;
    }

    setIsLoading(true);

    try {
      const token = await getAccessToken();
      const response = await fetch(imgUrl, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = await response.blob();
      setImgUrl(URL.createObjectURL(blob));
      setIsUnlocked(true);
    } catch (error) {
      toast.error("Verification failed, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <img
        src={imgUrl || "/placeholder.svg"}
        className={cn(
          "w-full h-full object-cover transition-all duration-300",
          !isUnlocked && "blur-[10px]"
        )}
      />

      {!isUnlocked && (
        <div
          className="absolute inset-0 bg-neutral-400 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-neutral-500"
          onClick={handleUnlock}
        >
          <Lock
            className={cn(
              "w-8 h-8 text-white mb-3 transition-transform",
              isLoading && "animate-pulse"
            )}
          />
          <p className="text-white text-base font-semibold mb-1">
            {isLoading ? "Verifying..." : "Click to view image"}
          </p>
          <p className="text-white/90 text-sm text-center px-4">
            {isLoading
              ? "Checking token ownership..."
              : `Hold $${creatorToken?.symbol} tokens to unlock`}
          </p>
        </div>
      )}
    </div>
  );
}

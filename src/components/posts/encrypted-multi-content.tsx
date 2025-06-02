"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { Token } from "@/types";
import {
  getDecryptionImageApiWithArid,
  getDecryptionMultiContentApiWithPageLink,
  getDecryptionTextApiWithArid,
} from "@/lib/encrypted-record";

interface EncryptedMultiContentProps {
  visitLink: string;
  alt?: string;
  creatorToken?: Token;
  className?: string;
}

export function EncryptedMultiContent({
  visitLink,
  alt,
  creatorToken,
  className,
}: EncryptedMultiContentProps) {
  const [text, setText] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { authenticated, login, user, linkWallet } = usePrivy();
  const walletAddress = user?.wallet?.address || "";

  const handleUnlock = async () => {
    if (!authenticated) {
      toast.error("You must be logged in to unlock this text");
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
      const api = getDecryptionMultiContentApiWithPageLink(visitLink);
      console.log("API:", api);
      const response = await fetch(api, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const jsonContent = await response.json();
      const { text_ar_id, image_ar_id } = jsonContent || {};
      if (text_ar_id) {
        const textApi = getDecryptionTextApiWithArid(text_ar_id);
        console.log("API:", textApi);
        const response = await fetch(textApi, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const decryptedText = await response.text();
        setText(decryptedText);
      }

      if (image_ar_id) {
        const imageApi = getDecryptionImageApiWithArid(image_ar_id);
        console.log("Image API:", imageApi);
        const imageResponse = await fetch(imageApi, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const blob = await imageResponse.blob();
        setImgUrl(URL.createObjectURL(blob));
      }

      setIsUnlocked(true);
    } catch (error) {
      toast.error("Verification failed, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-accent min-h-[500px] p-4 flex flex-col gap-4 items-center justify-center",
        className
      )}
    >
      {!!text && (
        <span className="text-accent-foreground text-sm md:text-base font-mono whitespace-pre-wrap break-words transition-all duration-300">
          {text}
        </span>
      )}

      {!!imgUrl && (
        <img
          src={imgUrl}
          className={cn(
            "w-full h-full object-cover transition-all duration-300",
            !isUnlocked && "blur-[10px]"
          )}
        />
      )}

      {!isUnlocked && (
        <div
          className="w-full h-full absolute inset-0 bg-neutral-400 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-neutral-500"
          onClick={handleUnlock}
        >
          <Lock
            className={cn(
              "w-8 h-8 text-white mb-3 transition-transform",
              isLoading && "animate-pulse"
            )}
          />
          <p className="text-white text-base font-semibold mb-1">
            {isLoading ? "Verifying..." : "Click to view content"}
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

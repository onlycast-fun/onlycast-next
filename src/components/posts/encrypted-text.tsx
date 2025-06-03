"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { Token } from "@/types";
import { getDecryptionTextApiWithPageLink } from "@/lib/encrypted-record";
import { useUserInfo } from "@/providers/userinfo-provider";

interface EncryptedTextProps {
  visitLink: string;
  alt?: string;
  creatorToken?: Token;
  className?: string;
}

export function EncryptedText({
  visitLink,
  alt,
  creatorToken,
  className,
}: EncryptedTextProps) {
  const [text, setText] = useState<string>(visitLink);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { authenticated, login, user, linkWallet } = usePrivy();
  const { fcUser } = useUserInfo();
  const fcWalletAddress = fcUser?.verified_addresses?.eth_addresses?.[0] || "";

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
      const api = getDecryptionTextApiWithPageLink(visitLink);
      const response = await fetch(api, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const decryptedText = await response.text();
      setText(decryptedText);
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
        "relative overflow-hidden rounded-lg bg-accent min-h-[150px] p-4 flex items-center justify-center",
        className
      )}
    >
      <span className="text-accent-foreground text-sm md:text-base font-mono whitespace-pre-wrap break-words transition-all duration-300">
        {text}
      </span>

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
            {isLoading ? "Verifying..." : "Click to view text"}
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

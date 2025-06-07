"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getAccessToken, usePrivy } from "@privy-io/react-auth";
import { Token } from "@/types";
import { useUserInfo } from "@/providers/userinfo-provider";
import { UnlockOverlay } from "./unlock-overlay";
import { getDecryptApiWithArid } from "@/lib/encrypted-record";
import { RecordType } from "@/types/encrypted-record";
import { getUserPrimaryEthAddress } from "@/lib/farcaster/user";

interface EncryptedTextProps {
  arid: string;
  alt?: string;
  creatorToken?: Token;
  className?: string;
}

export function EncryptedText({
  arid,
  alt,
  creatorToken,
  className,
}: EncryptedTextProps) {
  const [text, setText] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { authenticated, login, user, linkWallet } = usePrivy();
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
      const api = getDecryptApiWithArid(arid);
      const response = await fetch(api, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const decryptedText = await response.text();
        setText(decryptedText);
        setIsUnlocked(true);
      } else {
        const errorText = await response.text();
        toast.error(errorText || "Failed to unlock text");
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
      contentType={RecordType.text}
      isUnlocked={isUnlocked}
      isLoading={isLoading}
      onUnlockClick={handleUnlock}
    >
      <UnlockText text={text} />
    </UnlockOverlay>
  );
}

export function UnlockText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-accent min-h-32  p-4 flex items-center justify-center",
        className
      )}
    >
      <span className="text-accent-foreground text-sm md:text-base font-mono whitespace-pre-wrap break-words transition-all duration-300">
        {text}
      </span>
    </div>
  );
}

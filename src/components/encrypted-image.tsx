"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EncryptedImageProps {
  src: string;
  alt: string;
  creatorToken: string;
  className?: string;
}

export function EncryptedImage({
  src,
  alt,
  creatorToken,
  className,
}: EncryptedImageProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async () => {
    setIsLoading(true);

    try {
      // Simulate token verification process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate verification result (random success/failure)
      const hasToken = Math.random() > 0.5;

      if (hasToken) {
        setIsUnlocked(true);
        toast.success("Image unlocked!");
      } else {
        toast.error(
          `You need to hold ${creatorToken} tokens to unlock this image`
        );
      }
    } catch (error) {
      toast.error("Verification failed, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-all duration-300",
          !isUnlocked && "blur-[10px]"
        )}
      />

      {!isUnlocked && (
        <div
          className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-black/30"
          onClick={handleUnlock}
        >
          <Lock
            className={cn(
              "w-8 h-8 text-white mb-2 transition-transform",
              isLoading && "animate-pulse"
            )}
          />
          <p className="text-white text-sm font-medium">
            {isLoading ? "Verifying..." : "Click to verify tokens"}
          </p>
        </div>
      )}
    </div>
  );
}

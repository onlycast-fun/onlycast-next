"use client";

import { type ReactNode } from "react";
import { Lock, Coins, FileText, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecordType } from "@/types/encrypted-record";

interface UnlockOverlayProps {
  children: ReactNode;
  creatorToken: string;
  requiredAmount?: number;
  className?: string;
  previewIntensity?: "light" | "medium" | "heavy";
  contentType?: RecordType;
  isUnlocked: boolean;
  isLoading?: boolean;
  onUnlockClick: () => void;
}

export function UnlockOverlay({
  children,
  creatorToken,
  requiredAmount = 1,
  className,
  previewIntensity = "medium",
  contentType = RecordType.image,
  isUnlocked = false,
  isLoading = false,
  onUnlockClick,
}: UnlockOverlayProps) {
  const getBlurIntensity = () => {
    switch (previewIntensity) {
      case "light":
        return "blur-[4px]";
      case "medium":
        return "blur-[8px]";
      case "heavy":
        return "blur-[12px]";
      default:
        return "blur-[8px]";
    }
  };

  const getPreviewOpacity = () => {
    switch (previewIntensity) {
      case "light":
        return "opacity-70";
      case "medium":
        return "opacity-50";
      case "heavy":
        return "opacity-30";
      default:
        return "opacity-50";
    }
  };

  const getContentStyles = () => {
    if (isUnlocked) return "";

    if (contentType === "text") {
      return cn(
        "select-none",
        getBlurIntensity(),
        getPreviewOpacity(),
        "transition-all duration-500"
      );
    } else {
      return cn(
        getBlurIntensity(),
        getPreviewOpacity(),
        "transition-all duration-500"
      );
    }
  };

  const getContentTypeInfo = () => {
    switch (contentType) {
      case "text":
        return {
          icon: FileText,
          badgeText: "Text",
        };
      case "image":
        return {
          icon: Layers,
          badgeText: "Content",
        };
      case "mixed":
        return {
          icon: Layers,
          badgeText: "Mixed Content",
        };
      default:
        return {
          icon: Layers,
          badgeText: "Content",
        };
    }
  };

  const contentInfo = getContentTypeInfo();
  const IconComponent = contentInfo.icon;

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      {/* Content with conditional blur */}
      <div className={getContentStyles()}>{children}</div>

      {/* Unlock Overlay - Using theme system colors */}
      {!isUnlocked && (
        <div
          className={cn(
            "absolute inset-0 flex flex-col transition-all duration-300 min-h-[240px]",
            "bg-muted/90 backdrop-blur-sm"
          )}
        >
          {/* Top Badges Row */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {/* Content Type Badge with Icon - No shadow */}
            <Badge
              variant="outline"
              className="bg-background/80 text-foreground border-border gap-1.5 text-xs backdrop-blur-sm"
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{contentInfo.badgeText}</span>
            </Badge>

            {/* Premium Badge */}
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 gap-1 text-xs"
            >
              Premium
            </Badge>
          </div>

          {/* Lock Icon - Positioned in upper-center area with 50% opacity */}
          <div className="flex-1 flex items-center justify-center pt-8">
            <div className="flex items-center justify-center">
              {isLoading ? (
                <div className="w-12 h-12 border-4 border-muted-foreground/50 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Lock className="w-12 h-12 text-muted-foreground/50 drop-shadow-sm" />
              )}
            </div>
          </div>

          {/* Button Container - Full width with border */}
          <div className="flex items-end justify-center pb-3 px-3">
            <div className="w-full border border-border rounded-lg p-4 bg-background/50 backdrop-blur-sm">
              <Button
                onClick={onUnlockClick}
                disabled={isLoading}
                className={cn(
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                  "px-8 py-4 text-base font-semibold",
                  "transition-colors duration-200", // Removed scale and shadow
                  "w-full", // Full width within container
                  "rounded-full", // Pill-shaped button
                  "h-12", // Fixed height for consistent pill shape
                  isLoading && "opacity-70 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5" />
                  <span>
                    {isLoading
                      ? "Verifying..."
                      : `Hold ${requiredAmount.toLocaleString()} $${creatorToken} to unlock`}
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success State - Positioned at bottom center */}
      {isUnlocked && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge
            variant="default"
            className="bg-green-500 text-white gap-1 text-xs shadow-lg"
          >
            Unlocked
          </Badge>
        </div>
      )}
    </div>
  );
}

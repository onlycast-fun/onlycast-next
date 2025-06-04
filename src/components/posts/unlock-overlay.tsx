"use client";

import { useState, type ReactNode } from "react";
import {
  Lock,
  Eye,
  Sparkles,
  Star,
  Coins,
  ImageIcon,
  FileText,
  Play,
  Music,
  FileIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface UnlockOverlayProps {
  children: ReactNode;
  creatorToken: string;
  requiredAmount?: number;
  className?: string;
  previewIntensity?: "light" | "medium" | "heavy";
  contentType?: "image" | "text" | "video" | "audio" | "content";
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
  contentType = "image",
  isUnlocked = false,
  isLoading = false,
  onUnlockClick,
}: UnlockOverlayProps) {
  const [isHovered, setIsHovered] = useState(false);

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

    return cn(
      getBlurIntensity(),
      getPreviewOpacity(),
      "transition-all duration-500"
    );
  };

  const getContentTypeInfo = () => {
    switch (contentType) {
      case "image":
        return {
          icon: ImageIcon,
          label: "Premium Image",
          badgeText: "Image",
          requirementText: "Hold {amount} {token} tokens to view this image",
        };
      case "text":
        return {
          icon: FileText,
          label: "Premium Text",
          badgeText: "Text",
          requirementText: "Hold {amount} {token} tokens to read this text",
        };
      case "video":
        return {
          icon: Play,
          label: "Premium Video",
          badgeText: "Video",
          requirementText: "Hold {amount} {token} tokens to watch this video",
        };
      case "audio":
        return {
          icon: Music,
          label: "Premium Audio",
          badgeText: "Audio",
          requirementText:
            "Hold {amount} {token} tokens to listen to this audio",
        };
      case "content":
        return {
          icon: FileIcon,
          label: "Premium Document",
          badgeText: "Multi Content",
          requirementText: "Hold {amount} {token} tokens to view this content",
        };
      default:
        return {
          icon: Lock,
          label: "Premium Content",
          badgeText: "Content",
          requirementText: "Hold {amount} {token} tokens to unlock",
        };
    }
  };

  const contentInfo = getContentTypeInfo();
  const ContentIcon = contentInfo.icon;

  // Replace placeholders in requirement text
  const requirementText = contentInfo.requirementText
    .replace("{amount}", requiredAmount.toLocaleString())
    .replace("{token}", creatorToken);

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content with conditional blur */}
      <div className={getContentStyles()}>{children}</div>

      {/* Unlock Overlay */}
      {!isUnlocked && (
        <div
          className={cn(
            "absolute inset-0 flex flex-col transition-all duration-300 cursor-pointer min-h-[240px]",
            "bg-black/40 backdrop-blur-[3px]",
            isHovered && "bg-black/50 backdrop-blur-[2px]"
          )}
          onClick={onUnlockClick}
        >
          {/* Top Badges Row */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-30">
            {/* Content Type Badge */}
            <Badge
              variant="outline"
              className="bg-black/60 text-white border-white/20 gap-1 shadow-lg text-xs backdrop-blur-sm"
            >
              <ContentIcon className="w-3 h-3" />
              {contentInfo.badgeText}
            </Badge>

            {/* Premium Badge */}
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 gap-1 shadow-lg text-xs"
            >
              <Star className="w-3 h-3 fill-current" />
              Premium
            </Badge>
          </div>

          {/* Main Content Container */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative z-10 min-h-[200px]">
            {/* Lock Icon with Animation */}
            <div
              className={cn(
                "relative w-12 h-12 md:w-14 md:h-14 rounded-full mb-4",
                "bg-gradient-to-br from-primary/90 to-primary/70 backdrop-blur-sm",
                "flex items-center justify-center shadow-2xl",
                "transition-all duration-300 group-hover:scale-110",
                isLoading && "animate-pulse"
              )}
            >
              {isLoading ? (
                <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <Sparkles
                    className={cn(
                      "absolute -top-1 -right-1 w-3 h-3 text-yellow-300",
                      "transition-all duration-300",
                      isHovered && "scale-125 rotate-12"
                    )}
                  />
                </>
              )}
            </div>

            {/* Token Requirement Display */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                <Coins className="w-3 h-3 text-yellow-400" />
                <span className="text-white text-sm font-semibold">
                  {requiredAmount.toLocaleString()} ${creatorToken}
                </span>
              </div>

              {/* Requirement Text */}
              <p className="text-white text-xs md:text-sm font-medium drop-shadow-md text-center max-w-xs">
                {isLoading ? "Verifying tokens..." : requirementText}
              </p>

              {/* Action Text */}
              {!isLoading && (
                <div className="flex items-center justify-center gap-1 text-white text-xs md:text-sm bg-black/40 px-2 py-1 rounded-full">
                  <Eye className="w-3 h-3" />
                  <span>Tap to unlock</span>
                </div>
              )}
            </div>
          </div>

          {/* Hover Effect Indicator */}
          {!isLoading && isHovered && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-20">
              <div className="flex items-center gap-1 text-white text-xs bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                <div className="w-1 h-1 bg-white/80 rounded-full animate-pulse" />
                <span className="font-medium">Unlock</span>
              </div>
            </div>
          )}

          {/* Simplified Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner Decorations */}
            <div className="absolute top-1 left-1 w-4 h-4 border-t border-l border-white/20 rounded-tl" />
            <div className="absolute top-1 right-1 w-4 h-4 border-t border-r border-white/20 rounded-tr" />
            <div className="absolute bottom-1 left-1 w-4 h-4 border-b border-l border-white/20 rounded-bl" />
            <div className="absolute bottom-1 right-1 w-4 h-4 border-b border-r border-white/20 rounded-br" />
          </div>
        </div>
      )}

      {/* Success State */}
      {isUnlocked && (
        <div className="absolute top-2 right-2 z-30">
          <Badge
            variant="default"
            className="bg-green-500 text-white gap-1 text-xs"
          >
            <Eye className="w-3 h-3" />
            Unlocked
          </Badge>
        </div>
      )}
    </div>
  );
}

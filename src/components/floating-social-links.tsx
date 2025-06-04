"use client";

import { useState } from "react";
import { Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FloatingSocialLinks({
  socialLinks,
}: {
  socialLinks: {
    name: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
  }[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
      <div className="flex flex-col items-end space-y-2">
        {/* Social Links */}
        <div
          className={cn(
            "flex flex-col space-y-2 transition-all duration-300 ease-in-out",
            isExpanded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          {socialLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Button
                key={link.name}
                variant="outline"
                size="icon"
                onClick={() => handleLinkClick(link.url)}
                className={cn(
                  "h-10 w-10 rounded-full shadow-lg bg-background/95 backdrop-blur border-border/50",
                  "transition-all duration-200 hover:scale-110",
                  link.color
                )}
                title={`Visit our ${link.name}`}
              >
                <IconComponent className="w-4 h-4" />
              </Button>
            );
          })}
        </div>

        {/* Toggle Button */}
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-12 w-12 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title={isExpanded ? "Hide social links" : "Show social links"}
        >
          {isExpanded ? (
            <X className="w-5 h-5" />
          ) : (
            <Share2 className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}

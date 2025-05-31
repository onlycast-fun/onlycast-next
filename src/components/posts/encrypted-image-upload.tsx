"use client";

import { useState, useEffect } from "react";
import { Upload, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EncryptedImageUploadProps {
  value?: File;
  onChange: (file: File | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function EncryptedImageUpload({
  value,
  onChange,
  disabled = false,
  className,
}: EncryptedImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Create preview URL when file changes
  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleImageChange = (file: File | null) => {
    onChange(file || undefined);
  };

  const removeImage = () => {
    onChange(undefined);
  };

  const handleFileSelect = () => {
    if (!disabled) {
      document.getElementById("encrypted-image-upload")?.click();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-border">
          <div className="relative aspect-video">
            {/* Preview with blur overlay */}
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {/* Encryption overlay */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center">
              <Lock className="w-8 h-8 text-white mb-2" />
              <p className="text-white text-sm font-medium">
                This image will be encrypted
              </p>
              <p className="text-white/80 text-xs">
                Only your token holders can unlock
              </p>
            </div>
          </div>
          {/* Remove button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
            onClick={removeImage}
            disabled={disabled}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
            disabled
              ? "border-muted-foreground/10 bg-muted/30 cursor-not-allowed"
              : "border-primary/25 hover:border-primary/50"
          )}
          onClick={handleFileSelect}
        >
          <div className="flex flex-col items-center">
            <div className="mb-3 p-3 rounded-full bg-primary/10">
              <Lock
                className={`w-6 h-6 ${
                  disabled ? "text-muted-foreground/50" : "text-primary"
                }`}
              />
            </div>
            <p
              className={`text-sm font-medium mb-1 ${
                disabled ? "text-muted-foreground/50" : "text-foreground"
              }`}
            >
              Add an encrypted image
            </p>
            <p
              className={`text-xs mb-4 ${
                disabled ? "text-muted-foreground/50" : "text-muted-foreground"
              }`}
            >
              Only users who hold your token can view this image
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleImageChange(file);
              }}
              className="hidden"
              id="encrypted-image-upload"
              disabled={disabled}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                handleFileSelect();
              }}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Select Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

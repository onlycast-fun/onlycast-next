"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: File;
  onChange: (file: File | undefined) => void;
  disabled?: boolean;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
  compact?: boolean; // New prop for compact mode
}

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  className,
  accept = "image/*",
  maxSize = 1, // 1MB default
  compact = false, // Default to false for backward compatibility
}: ImageUploadProps) {
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

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      onChange(undefined);
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    onChange(file);
  };

  const removeImage = () => {
    onChange(undefined);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const handleClick = () => {
    if (!disabled) {
      document.getElementById("image-upload-input")?.click();
    }
  };

  if (previewUrl) {
    return (
      <div className={cn("relative", className)}>
        <div className="relative rounded-lg overflow-hidden border border-border group flex items-center justify-center">
          <div
            className={cn(
              "aspect-square",
              compact ? "max-h-[120px]" : "max-h-[200px]"
            )}
          >
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Remove button */}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className={cn(
              "absolute top-2 right-2 rounded-full opacity-80 hover:opacity-100",
              compact ? "h-6 w-6" : "h-8 w-8"
            )}
            onClick={removeImage}
            disabled={disabled}
          >
            <X className={cn(compact ? "h-3 w-3" : "h-4 w-4")} />
          </Button>

          {/* Overlay with file info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <div className="text-white text-xs">
              <p className="font-medium truncate">{value?.name}</p>
              <p className="text-xs opacity-80">
                {value ? `${(value.size / 1024 / 1024).toFixed(2)} MB` : ""}
              </p>
            </div>
          </div>

          {/* Change image button */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size={compact ? "sm" : "sm"}
              onClick={handleClick}
              disabled={disabled}
              className="bg-white/90 hover:bg-white text-black"
            >
              Change
            </Button>
          </div>
        </div>

        <input
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          id="image-upload-input"
          disabled={disabled}
        />
      </div>
    );
  }

  // Compact mode - simplified upload area
  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 cursor-pointer",
            disabled
              ? "border-muted-foreground/10 bg-muted/30 cursor-not-allowed"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
          )}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center space-y-3">
            {/* Icon */}
            <div
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                disabled ? "bg-muted/50" : "bg-muted/80 hover:bg-primary/10"
              )}
            >
              <ImageIcon
                className={cn(
                  "w-5 h-5 transition-all duration-300",
                  disabled
                    ? "text-muted-foreground/50"
                    : "text-muted-foreground hover:text-primary"
                )}
              />
            </div>

            {/* Text */}
            <div className="space-y-1">
              <p
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  disabled
                    ? "text-muted-foreground/50"
                    : "text-foreground hover:text-primary"
                )}
              >
                Upload Token Image
              </p>
              <p
                className={cn(
                  "text-xs",
                  disabled
                    ? "text-muted-foreground/50"
                    : "text-muted-foreground"
                )}
              >
                JPG, PNG, GIF up to {maxSize}MB
              </p>
            </div>

            <input
              type="file"
              accept={accept}
              onChange={handleFileInputChange}
              className="hidden"
              id="image-upload-input"
              disabled={disabled}
            />

            <Button
              type="button"
              variant={disabled ? "secondary" : "default"}
              size="sm"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Choose Image
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Original full-size mode with drag and drop (for backward compatibility)
  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer",
          disabled
            ? "border-muted-foreground/10 bg-muted/30 cursor-not-allowed"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
        )}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Icon */}
          {/* <div
            className={cn(
              "p-4 rounded-full transition-all duration-300",
              disabled ? "bg-muted/50" : "bg-muted/80 hover:bg-primary/10"
            )}
          >
            <ImageIcon
              className={cn(
                "w-8 h-8 transition-all duration-300",
                disabled
                  ? "text-muted-foreground/50"
                  : "text-muted-foreground hover:text-primary"
              )}
            />
          </div> */}

          {/* Text */}
          <div className="space-y-2">
            {/* <p
              className={cn(
                "text-base font-medium transition-colors duration-300",
                disabled
                  ? "text-muted-foreground/50"
                  : "text-foreground hover:text-primary"
              )}
            >
              Upload Token Image
            </p> */}
            <p
              className={cn(
                "text-xs text-center",
                disabled ? "text-muted-foreground/50" : "text-muted-foreground"
              )}
            >
              Supports JPG, PNG, GIF up to {maxSize}MB
            </p>
          </div>

          <input
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            className="hidden"
            id="image-upload-input"
            disabled={disabled}
          />

          <Button
            type="button"
            variant={disabled ? "secondary" : "default"}
            size="lg"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="gap-2 transition-all duration-300"
          >
            <Upload className="w-5 h-5" />
            Choose Image
          </Button>
        </div>
      </div>
    </div>
  );
}

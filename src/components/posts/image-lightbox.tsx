"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageLightboxProps {
  src: string;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  src,
  alt,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset transform when opening/closing
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev / 1.5, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && scale > 1 && e.touches.length === 1) {
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const resetTransform = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm">
      {/* Close overlay - click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Controls - Desktop */}
      <div className="hidden md:flex absolute top-4 right-4 z-10 gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
          className="bg-black/50 hover:bg-black/70 text-white border-white/20"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomIn}
          disabled={scale >= 5}
          className="bg-black/50 hover:bg-black/70 text-white border-white/20"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleRotate}
          className="bg-black/50 hover:bg-black/70 text-white border-white/20"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={onClose}
          className="bg-black/50 hover:bg-black/70 text-white border-white/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Controls - Mobile */}
      <div className="md:hidden absolute top-4 left-4 right-4 z-10">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20 h-8 px-2"
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomIn}
              disabled={scale >= 5}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20 h-8 px-2"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRotate}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20 h-8 px-2"
            >
              <RotateCw className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="bg-black/50 hover:bg-black/70 text-white border-white/20 h-8 px-2"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div
          className={cn(
            "relative max-w-full max-h-full transition-transform duration-200",
            isDragging
              ? "cursor-grabbing"
              : scale > 1
              ? "cursor-grab"
              : "cursor-default"
          )}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={src || "/placeholder.svg"}
            alt={alt}
            className="max-w-full max-h-full object-contain select-none"
            draggable={false}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Bottom Info - Mobile */}
      <div className="md:hidden absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-center">
          <p className="text-white text-sm truncate">{alt}</p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-white/70">
            <span>Zoom: {Math.round(scale * 100)}%</span>
            <span>Rotation: {rotation}°</span>
          </div>
          {scale > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetTransform}
              className="mt-2 text-white hover:bg-white/20 h-6 text-xs"
            >
              Reset View
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Info - Desktop */}
      <div className="hidden md:block absolute bottom-4 left-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <p className="text-white text-sm mb-2">{alt}</p>
          <div className="flex gap-4 text-xs text-white/70">
            <span>Zoom: {Math.round(scale * 100)}%</span>
            <span>Rotation: {rotation}°</span>
            {scale > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetTransform}
                className="text-white hover:bg-white/20 h-5 text-xs px-2 ml-2"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Instructions - Desktop */}
      <div className="hidden md:block absolute bottom-4 right-4 z-10">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-white/70 max-w-xs">
          <p>• Click and drag to pan (when zoomed)</p>
          <p>• Press ESC to close</p>
          <p>• Click outside to close</p>
        </div>
      </div>
    </div>
  );
}

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Embeds } from "@/lib/farcaster/cast-embed";
import { useEffect, useState } from "react";

export default function EmbedImgs({
  imgs,
  maxHeight,
}: {
  imgs: Embeds["imgs"];
  maxHeight?: number;
}) {
  return (
    <>
      {imgs.map((img, idx) => {
        const { url, metadata } = img;
        if (!metadata?.image?.width_px || !metadata?.image?.height_px) {
          return <img src={url} key={url} />;
        }
        const { width_px, height_px } = metadata.image;
        const ratio = width_px / height_px;
        return (
          <div
            key={url}
            style={{
              width: `${maxHeight ? maxHeight * ratio : width_px}px`,
              maxWidth: "100%",
            }}
            className="mx-auto"
          >
            <AspectRatio ratio={ratio}>
              <img
                src={url}
                style={{
                  borderRadius: 10,
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  ...(maxHeight ? { maxHeight } : {}),
                }}
              />
            </AspectRatio>
          </div>
        );
      })}
    </>
  );
}

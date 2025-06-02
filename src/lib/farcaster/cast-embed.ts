import { NeynarCast } from "@/types/neynar";
import { Buffer } from "buffer";
import {
  isEncryptedImageLink,
  isEncryptedMultiContentLink,
  isEncryptedTextLink,
} from "../encrypted-record";

export function isImg(url?: string) {
  if (!url) return false;
  return (
    url.endsWith(".png") ||
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".gif") ||
    url.startsWith("https://imagedelivery")
  );
}

export function isVideo(url?: string) {
  if (!url) return false;
  return (
    url.endsWith(".mp4") ||
    url.endsWith(".mov") ||
    url.endsWith(".avi") ||
    url.endsWith(".webm") ||
    url.endsWith(".mkv") ||
    url.endsWith(".m3u8")
  );
}

export type Embeds = {
  imgs: Array<{
    metadata: {
      content_type: string;
      content_length: string;
      image: {
        width_px: number;
        height_px: number;
      };
    };
    url: string;
  }>;
  videos: { url: string }[];
  webpages: {
    url: string;
  }[];
  casts: Array<{
    castId: { fid: number; hash: string };
    cast_id?: { fid: number; hash: string };
  }>;
  encryptedTexts: Array<{
    url: string;
  }>;
  encryptedImgs: Array<{
    url: string;
  }>;
  encryptedMultiContents: Array<{
    url: string;
  }>;
};

export function formatEmbeds(embeds: NeynarCast["embeds"]): Embeds {
  const imgs = [];
  const videos = [];
  const webpages = [];
  const casts = [];
  const encryptedTexts = [];
  const encryptedImgs = [];
  const encryptedMultiContents = [];

  for (const embed of embeds) {
    if (embed?.cast_id) {
      casts.push(embed);
    } else if (embed?.castId) {
      casts.push({
        ...embed,
        castId: {
          ...embed.castId,
          hash: Buffer.from(embed?.castId.hash).toString("hex"),
        },
      });
    } else if (embed?.cast_id) {
      casts.push({
        ...embed,
        cast_id: {
          ...embed.cast_id,
          hash: Buffer.from(embed?.cast_id.hash).toString("hex"),
        },
      });
    } else if (embed?.url) {
      if (isImg(embed.url)) {
        imgs.push(embed);
      } else if (isVideo(embed.url)) {
        videos.push({
          url: embed.url,
        });
      } else if (isEncryptedMultiContentLink(embed.url)) {
        encryptedMultiContents.push({
          url: embed.url,
        });
      } else if (isEncryptedTextLink(embed.url)) {
        encryptedTexts.push({
          url: embed.url,
        });
      } else if (isEncryptedImageLink(embed.url)) {
        encryptedImgs.push({
          url: embed.url,
        });
      } else {
        webpages.push({
          url: embed.url,
        });
      }
    }
  }
  return {
    imgs,
    webpages,
    casts,
    videos,
    encryptedTexts,
    encryptedImgs,
    encryptedMultiContents,
  };
}

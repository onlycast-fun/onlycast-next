import { useMemo } from "react";
import Link from "next/link";
import { NeynarCast } from "@/types/neynar";
import { formatEmbeds } from "@/lib/farcaster/cast-embed";
import isURL from "validator/lib/isURL";
import {
  getFarcasterChannelPath,
  getFarcasterUserPath,
} from "@/lib/farcaster/path";

export default function NeynarCastText({
  cast,
  viewMoreWordLimits,
}: {
  cast: NeynarCast;
  viewMoreWordLimits?: number;
}) {
  const { text, mentioned_profiles } = cast;
  const embeds = useMemo(() => formatEmbeds(cast.embeds), [cast]);
  const embedWebpages = embeds.webpages;
  const segments = text.split(/(\s|\n)/).map((part: string, index: number) => {
    if (viewMoreWordLimits) {
      if (index === viewMoreWordLimits) {
        return (
          <span key={index}>
            <span className="inline-block text-primary hover:cursor-pointer hover:underline">
              {" "}
              ... view more
            </span>
          </span>
        );
      }
      if (index > viewMoreWordLimits) {
        return null;
      }
    }
    if (isMention(part)) {
      const mentionData = mentioned_profiles?.find(
        (profile) => profile.username === part.slice(1)
      );
      if (mentionData) {
        const fname = mentionData.username.replace(/^@/, "");
        if (!fname) return null;
        return (
          <Link
            href={getFarcasterUserPath(fname)}
            target="_blank"
            key={index}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span className="inline-block text-primary hover:cursor-pointer hover:underline">
              {part}
            </span>
          </Link>
        );
      }
      return (
        <span
          key={index}
          className="inline-block text-primary hover:cursor-pointer hover:underline"
        >{`${part}`}</span>
      );
    }
    if (part.startsWith("/")) {
      const channelId = part.slice(1);
      return (
        <Link
          key={index}
          href={getFarcasterChannelPath(channelId)}
          target="_blank"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="inline-block text-primary hover:cursor-pointer hover:underline">
            {part}
          </span>
        </Link>
      );
    }
    if (isURL(part, { require_protocol: false })) {
      const link = !(
        part.toLowerCase().startsWith("https://") ||
        part.toLowerCase().startsWith("http://")
      )
        ? `https://${part}`
        : part;
      const findWebpage = embedWebpages.find((item) => {
        return item.url.includes(part);
      });
      if (findWebpage) return null;

      return (
        <span
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            window.open(link, "_blank", "noopener,noreferrer");
          }}
        >
          <span className="inline-block break-all text-primary hover:cursor-pointer hover:underline">
            {part}
          </span>
        </span>
      );
    }
    return (
      <span className=" text-foreground wrap-break-word  " key={index}>
        {part}
      </span>
    );
  });
  return (
    <span key={cast.hash} className="inline text-foreground">
      {segments}
    </span>
  );
}

function isMention(part: string) {
  return !!part && part.startsWith("@");
}

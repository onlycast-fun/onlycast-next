import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { EncryptedImage } from "@/components/posts/encrypted-image";
import dayjs from "dayjs";
import { NeynarCast } from "@/types/neynar";
import { Token } from "@/types";
import { useMemo } from "react";
import { formatEmbeds } from "@/lib/farcaster/cast-embed";
import EmbedImgs from "./casts/cast-imgs";
import NeynarCastText from "./casts/cast-text";
import Link from "next/link";
import { getFarcasterUserPath } from "@/lib/farcaster/path";
import { EncryptedText } from "./encrypted-text";

interface PostCardProps {
  token?: Token;
  cast: NeynarCast;
}

export function PostCard({ token, cast }: PostCardProps) {
  const { author, embeds } = cast;
  const formattedEmbeds = formatEmbeds(embeds);
  const { imgs, encryptedTexts, encryptedImgs } = formattedEmbeds;
  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardContent className="flex flex-col gap-4">
        {/* Creator Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={author.pfp_url || "/placeholder.svg"}
              alt={author.display_name || author.username}
            />
            <AvatarFallback>{author.display_name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Link
              className="font-medium text-sm hover:underline"
              href={getFarcasterUserPath(author.username)}
              target="_blank"
            >
              {author.display_name || author.username}
            </Link>
            <p className="text-xs text-muted-foreground">
              {dayjs(cast.timestamp).fromNow()}
            </p>
          </div>
        </div>

        {/* Post Content */}
        {!!cast.text && <NeynarCastText cast={cast} />}

        {/* Images */}
        {imgs.length > 0 && <EmbedImgs imgs={imgs} maxHeight={400} />}
        {/* Encrypted Texts */}
        {encryptedTexts.length > 0 &&
          encryptedTexts.map((text, idx) => (
            <EncryptedText
              key={idx}
              visitLink={text.url}
              creatorToken={token}
              className="mb-4"
            />
          ))}

        {/* Encrypted Image */}
        {encryptedImgs.length > 0 &&
          encryptedImgs.map((img, idx) => (
            <EncryptedImage
              key={idx}
              visitLink={img.url}
              creatorToken={token}
              className="w-full h-48 md:h-64 mb-4"
            />
          ))}
      </CardContent>
    </Card>
  );
}

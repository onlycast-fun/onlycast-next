import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { EncryptedImage } from "@/components/posts/encrypted-image";
import dayjs from "dayjs";
import { Author } from "@/types/neynar";
import { Token } from "@/types";
import Link from "next/link";
import { getFarcasterUserPath } from "@/lib/farcaster/path";
import { EncryptedText } from "./encrypted-text";
import { getClankerTokenPath } from "@/lib/clanker/path";
import { formatMarketCap } from "@/lib/utils";
import { EncryptedRecord, RecordType } from "@/types/encrypted-record";

interface PostCardProps {
  author: Author;
  token: Token;
  record: EncryptedRecord;
}

export function RecordInfoCard({ author, token, record }: PostCardProps) {
  const arid = record.ar_id;
  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardContent className="flex flex-col gap-4">
        {/* Creator Info */}
        <div className="flex items-start justify-between">
          {" "}
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
              {!!record?.created_at && (
                <p className="text-xs text-muted-foreground">
                  {dayjs(record.created_at).fromNow()}
                </p>
              )}
            </div>
          </div>
          {!!token && (
            <div className="flex flex-col items-end gap-1">
              <Link
                href={getClankerTokenPath(token.token_address)}
                target="_blank"
                className="p-0 font-medium text-sm text-primary hover:underline"
              >
                ${token.symbol}
              </Link>
              {!!token.market_cap && (
                <p className="text-xs text-muted-foreground">
                  {formatMarketCap(token.market_cap)}
                </p>
              )}
            </div>
          )}
        </div>

        <span className="inline text-foreground">
          {record?.description || ""}
        </span>

        {(() => {
          if (record.type === RecordType.text) {
            return (
              <div className="container mx-auto px-4 py-6 max-w-2xl">
                <EncryptedText arid={arid} creatorToken={token} />
              </div>
            );
          }
          if (record.type === RecordType.image) {
            return (
              <div className="container mx-auto px-4 py-6 max-w-2xl">
                <EncryptedImage
                  className="w-full min-h-48 md:h-64 mb-4"
                  arid={arid}
                  creatorToken={token}
                />
              </div>
            );
          }
          if (record.type === RecordType.mixed) {
            return (
              <div className="container mx-auto px-4 py-6 max-w-2xl">
                <EncryptedImage
                  className="w-full min-h-48 md:h-64 mb-4"
                  arid={arid}
                  creatorToken={token}
                />
              </div>
            );
          }
        })()}
      </CardContent>
    </Card>
  );
}

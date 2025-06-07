"use client";
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
import { User } from "@privy-io/react-auth";
import { EncryptedMixedContent } from "./encrypted-mixed-content";

interface PostCardProps {
  author: User;
  token: Token;
  record: EncryptedRecord;
}

export function RecordInfoCard({ author, token, record }: PostCardProps) {
  const arid = record.ar_id;
  const fcUser = author.farcaster;
  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardContent className="flex flex-col gap-4">
        {/* Creator Info */}
        <div className="flex items-start justify-between">
          {" "}
          {!!fcUser && (
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={fcUser?.pfp || "/placeholder.svg"}
                  alt={fcUser?.displayName || fcUser?.username || ""}
                />
                <AvatarFallback>{fcUser?.displayName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Link
                  className="font-medium text-sm hover:underline"
                  href={getFarcasterUserPath(fcUser?.username || "")}
                  target="_blank"
                >
                  {fcUser?.displayName || fcUser?.username}
                </Link>
                {!!record?.created_at && (
                  <p className="text-xs text-muted-foreground">
                    {dayjs(record?.created_at).fromNow()}
                  </p>
                )}
              </div>
            </div>
          )}
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
              <EncryptedText
                arid={arid}
                creatorToken={token}
                className="mb-4"
              />
            );
          }
          if (record.type === RecordType.image) {
            return (
              <EncryptedImage
                className="w-full min-h-48 md:h-64 mb-4"
                arid={arid}
                creatorToken={token}
              />
            );
          }
          if (record.type === RecordType.mixed) {
            return (
              <EncryptedMixedContent
                className="w-full min-h-48 md:h-64 mb-4"
                arid={arid}
                creatorToken={token}
              />
            );
          }
        })()}
      </CardContent>
    </Card>
  );
}

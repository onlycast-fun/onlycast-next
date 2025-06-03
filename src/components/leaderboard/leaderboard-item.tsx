"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import { formatMarketCap } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { LeaderboardItemData } from "@/types/leaderboard";
import Link from "next/link";
import { getFarcasterUserPath } from "@/lib/farcaster/path";
import { getClankerTokenPath } from "@/lib/clanker/path";

interface LeaderboardItemProps {
  data: LeaderboardItemData;
}

export function LeaderboardItem({ data }: LeaderboardItemProps) {
  const { user, token, score, rank } = data;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="text-lg font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-chart-1/10 border-chart-1/20";
      case 2:
        return "bg-chart-5/10 border-chart-5/20";
      case 3:
        return "bg-chart-4/10 border-chart-4/20";
      default:
        return "bg-card border-border";
    }
  };

  return (
    <Card
      className={cn("transition-all hover:shadow-md", getRankBackground(rank))}
    >
      <CardContent className="p-4 md:p-6">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Rank and User Info */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center justify-center w-12 h-12">
              {getRankIcon(rank)}
            </div>
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={user.pfp_url || "/placeholder.svg"}
                alt={user.display_name}
              />
              <AvatarFallback>{user.display_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <Link
                target="_blank"
                href={getFarcasterUserPath(user.username)}
                className="font-semibold text-base hover:underline"
              >
                {user.display_name}
              </Link>
              <Link
                target="_blank"
                href={getFarcasterUserPath(user.username)}
                className="text-sm text-muted-foreground hover:underline"
              >
                @{user.username}
              </Link>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center">
            <span className="text-2xl font-semibold">
              {score.toLocaleString()}
            </span>
          </div>

          {/* Token Info */}
          {!!token?.token_address && (
            <div className="flex flex-col items-end space-y-1 min-w-[120px]">
              <Badge variant="secondary" className="font-mono text-xs">
                <Link
                  target="_blank"
                  href={getClankerTokenPath(token.token_address)}
                  className="hover:underline"
                >
                  ${token.symbol}
                </Link>
              </Badge>
              <span className="text-sm text-muted-foreground font-mono">
                {formatMarketCap(token.market_cap)}
              </span>
            </div>
          )}
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:flex lg:hidden flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10">
              {getRankIcon(rank)}
            </div>
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={user.pfp_url || "/placeholder.svg"}
                alt={user.display_name}
              />
              <AvatarFallback>{user.display_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Link
                target="_blank"
                href={getFarcasterUserPath(user.username)}
                className="font-semibold"
              >
                {user.display_name}
              </Link>
              <Link
                target="_blank"
                href={getFarcasterUserPath(user.username)}
                className="text-sm text-muted-foreground hover:underline"
              >
                @{user.username}
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-semibold">
                {score.toLocaleString()}
              </span>
            </div>
            {!!token?.token_address && (
              <div className="flex flex-col items-end space-y-1">
                <Badge variant="secondary" className="font-mono text-xs">
                  <Link
                    href={getClankerTokenPath(token.token_address)}
                    className="hover:underline"
                  >
                    ${token.symbol}
                  </Link>
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatMarketCap(token.market_cap)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout - Two Rows */}
        <div className="md:hidden space-y-3">
          {/* First Row: Rank, Avatar, User Info, Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8">
                {rank <= 3 ? (
                  getRankIcon(rank)
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">
                    #{rank}
                  </span>
                )}
              </div>
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={user.pfp_url || "/placeholder.svg"}
                  alt={user.display_name}
                />
                <AvatarFallback>{user.display_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <Link
                  target="_blank"
                  href={getFarcasterUserPath(user.username)}
                  className="font-semibold text-sm"
                >
                  {user.display_name}
                </Link>
                <Link
                  target="_blank"
                  href={getFarcasterUserPath(user.username)}
                  className="text-xs text-muted-foreground"
                >
                  @{user.username}
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-lg font-semibold">
                {score.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Second Row: Token Info */}
          {!!token?.token_address && (
            <div className="flex items-center justify-between pl-11">
              <Badge variant="secondary" className="font-mono text-xs">
                <Link
                  target="_blank"
                  href={getClankerTokenPath(token.token_address)}
                  className="hover:underline"
                >
                  ${token.symbol}
                </Link>
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">
                {formatMarketCap(token.market_cap)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

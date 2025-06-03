"use client";

import { LeaderboardItem } from "@/components/leaderboard/leaderboard-item";
import { Trophy } from "lucide-react";
import { LeaderboardSkeleton } from "@/components/leaderboard/leaderboard-skeleton";
import { useLeaderboards } from "@/hooks/leaderboard/use-leaderboards";

export default function LeaderboardPage() {
  const { data, isLoading, error } = useLeaderboards();
  const items = data || [];

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-16 pb-20 md:pb-6">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Creator Leaderboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Top content creators by engagement score
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mb-8">
            <LeaderboardSkeleton count={10} />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Error Loading Data
            </h3>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:text-primary/80 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Leaderboard List */}
        {!isLoading && !error && items.length > 0 && (
          <div className="space-y-3 mb-8">
            {items.map((data) => (
              <LeaderboardItem key={data.user.custody_address} data={data} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && items.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No ranking data yet
            </h3>
            <p className="text-muted-foreground">
              Check back later for leaderboard updates
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

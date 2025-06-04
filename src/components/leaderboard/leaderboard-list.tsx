"use client";

import { LeaderboardItem } from "@/components/leaderboard/leaderboard-item";
import { LeaderboardSkeleton } from "@/components/leaderboard/leaderboard-skeleton";
import { Trophy } from "lucide-react";
import { useLeaderboards } from "@/hooks/leaderboard/use-leaderboards";

const ITEMS_PER_PAGE = 10;

export function LeaderboardList() {
  const { data, isLoading, error } = useLeaderboards();
  const items = data || [];

  return (
    <div className="space-y-8">
      {/* Loading State */}
      {isLoading && (
        <div className="mb-8">
          <LeaderboardSkeleton count={ITEMS_PER_PAGE} />
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
      {!isLoading && !error && (
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
  );
}

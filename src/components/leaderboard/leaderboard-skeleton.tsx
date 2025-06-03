import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LeaderboardItemSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-4 md:p-6">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Rank and User Info */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center justify-center w-12 h-12">
              <Skeleton className="w-6 h-6 rounded" />
            </div>
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center">
            <Skeleton className="h-8 w-20" />
          </div>

          {/* Token Info */}
          <div className="flex flex-col items-end space-y-1 min-w-[120px]">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:flex lg:hidden flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10">
              <Skeleton className="w-5 h-5 rounded" />
            </div>
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-16" />
            <div className="flex flex-col items-end space-y-1">
              <Skeleton className="h-4 w-14 rounded-full" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-3">
          {/* First Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8">
                <Skeleton className="w-4 h-4 rounded" />
              </div>
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-5 w-14" />
          </div>

          {/* Second Row */}
          <div className="flex items-center justify-between pl-11">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LeaderboardSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <LeaderboardItemSkeleton key={index} />
      ))}
    </div>
  );
}

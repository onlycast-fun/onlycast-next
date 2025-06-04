"use client";

import { Trophy, Gift } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardList } from "@/components/leaderboard/leaderboard-list";
import { AirdropInfo } from "@/components/leaderboard/airdrop-info";
import { LeaderboardItemData } from "@/types/leaderboard";

interface LeaderboardTabsProps {
  onUserClick?: (data: LeaderboardItemData) => void;
  defaultTab?: "leaderboard" | "airdrop";
  onTabChange?: (tab: "leaderboard" | "airdrop") => void;
}

export function LeaderboardTabs({
  defaultTab = "leaderboard",
  onTabChange,
}: LeaderboardTabsProps) {
  const handleTabChange = (value: string) => {
    const tab = value as "leaderboard" | "airdrop";
    onTabChange?.(tab);
  };

  return (
    <Tabs
      defaultValue={defaultTab}
      className="w-full"
      onValueChange={handleTabChange}
    >
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="leaderboard" className="gap-2">
          <Trophy className="w-4 h-4" />
          Leaderboard
        </TabsTrigger>
        <TabsTrigger value="airdrop" className="gap-2">
          <Gift className="w-4 h-4" />
          Airdrop Info
        </TabsTrigger>
      </TabsList>

      <TabsContent value="leaderboard">
        <LeaderboardList />
      </TabsContent>

      <TabsContent value="airdrop">
        <AirdropInfo />
      </TabsContent>
    </Tabs>
  );
}

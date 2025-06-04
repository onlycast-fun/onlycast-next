"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "airdrop">(
    "leaderboard"
  );

  const handleTabChange = (tab: "leaderboard" | "airdrop") => {
    setActiveTab(tab);
    // Additional logic can be added here if needed
  };

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

        {/* Leaderboard Tabs */}
        <LeaderboardTabs
          defaultTab="leaderboard"
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
}

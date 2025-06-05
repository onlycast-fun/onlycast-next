"use client";

import { useState, useEffect } from "react";
import { Gift, Clock, Trophy, Coins, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Airdrop end date - set to 30 days from now for demo
const AIRDROP_END_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

// Reward tiers based on creation order
const rewardTiers = [
  {
    range: "1-100",
    reward: "10,000",
    multiplier: "10x",
    color: "bg-yellow-500",
    description: "First 100 creators",
  },
  {
    range: "101-500",
    reward: "5,000",
    multiplier: "5x",
    color: "bg-orange-500",
    description: "Early adopters",
  },
  {
    range: "501-1,000",
    reward: "2,500",
    multiplier: "2.5x",
    color: "bg-blue-500",
    description: "Pioneer creators",
  },
  {
    range: "1,001-5,000",
    reward: "1,000",
    multiplier: "1x",
    color: "bg-green-500",
    description: "Community builders",
  },
  {
    range: "5,001+",
    reward: "500",
    multiplier: "0.5x",
    color: "bg-gray-500",
    description: "Standard reward",
  },
];

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function AirdropInfo() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [totalCreators, setTotalCreators] = useState(1247); // Mock current creator count

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = AIRDROP_END_DATE.getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const getCurrentTier = (creatorNumber: number) => {
    if (creatorNumber <= 100) return rewardTiers[0];
    if (creatorNumber <= 500) return rewardTiers[1];
    if (creatorNumber <= 1000) return rewardTiers[2];
    if (creatorNumber <= 5000) return rewardTiers[3];
    return rewardTiers[4];
  };

  const currentTier = getCurrentTier(totalCreators + 1);
  const progressToNextTier =
    totalCreators <= 100
      ? (totalCreators / 100) * 100
      : totalCreators <= 500
      ? ((totalCreators - 100) / 400) * 100
      : totalCreators <= 1000
      ? ((totalCreators - 500) / 500) * 100
      : totalCreators <= 5000
      ? ((totalCreators - 1000) / 4000) * 100
      : 100;
  return (
    <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 h-[200px] md:h-[300px]">
          <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold">
            Comming Soon
          </CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
  return (
    <div className="space-y-6">
      {/* Main Airdrop Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
            <Gift className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold">
              Official Token Airdrop
            </CardTitle>
          </div>
          <p className="text-muted-foreground text-sm md:text-base lg:text-lg">
            Phase 1: Rewarding Early Token Creators
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Countdown Timer */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-base md:text-lg font-semibold">
                Phase 1 Ends In:
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-sm md:max-w-md mx-auto">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="bg-primary text-primary-foreground rounded-lg p-3 md:p-4 font-mono text-lg md:text-2xl font-bold">
                    {item.value.toString().padStart(2, "0")}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Coins className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm md:text-base">
                Current Reward Tier
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3">
              <Badge
                variant="secondary"
                className={`${currentTier.color} text-white text-xs md:text-sm`}
              >
                {currentTier.range}
              </Badge>
              <span className="text-xl md:text-2xl font-bold text-primary">
                {currentTier.reward} CAST
              </span>
              <Badge variant="outline" className="text-xs md:text-sm">
                {currentTier.multiplier}
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-3">
              {currentTier.description}
            </p>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between text-xs md:text-sm gap-1 sm:gap-0">
                <span>Total Creators: {totalCreators.toLocaleString()}</span>
                <span>
                  Next Tier:{" "}
                  {totalCreators <= 5000 ? "Coming Soon" : "Final Tier"}
                </span>
              </div>
              {totalCreators <= 5000 && (
                <Progress value={progressToNextTier} className="h-2" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Tiers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Trophy className="w-5 h-5" />
            Airdrop Reward Tiers
          </CardTitle>
          <p className="text-muted-foreground text-sm md:text-base">
            Rewards are distributed based on token creation order. Earlier
            creators receive higher rewards.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rewardTiers.map((tier, index) => (
              <div
                key={tier.range}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 md:p-4 rounded-lg border transition-all gap-3 sm:gap-4 ${
                  tier.range === currentTier.range
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${tier.color}`} />
                    <span className="font-mono font-semibold text-sm md:text-base">
                      #{tier.range}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {tier.description}
                  </span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <Badge
                    variant="outline"
                    className="font-mono text-xs md:text-sm"
                  >
                    {tier.multiplier}
                  </Badge>
                  <span className="font-bold text-primary text-sm md:text-base">
                    {tier.reward} CAST
                  </span>
                  {tier.range === currentTier.range && (
                    <Badge variant="default" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to Participate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Calendar className="w-5 h-5" />
            How to Participate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 md:space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm md:text-base">
                Eligibility Requirements:
              </h4>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Create at least one token on OnlyCast platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Token must be created before Phase 1 deadline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Connected wallet must hold the created token</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>One reward per wallet address</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm md:text-base">
                Distribution Details:
              </h4>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Rewards distributed 7 days after Phase 1 ends</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>CAST tokens sent directly to wallet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Snapshot taken at Phase 1 deadline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Additional phases to be announced</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

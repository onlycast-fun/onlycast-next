"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TokenCard } from "@/components/tokens/token-card";
import { CreateTokenDialog } from "@/components/tokens/create-token-dialog";

// Mock data
const mockTokens = [
  {
    id: "1",
    name: "Alice Token",
    symbol: "ALICE",
    image: "/placeholder.svg?height=80&width=80",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    marketCap: 1250000,
  },
  {
    id: "2",
    name: "Bob Coin",
    symbol: "BOB",
    image: "/placeholder.svg?height=80&width=80",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    marketCap: 890000,
  },
  {
    id: "3",
    name: "Carol Token",
    symbol: "CAROL",
    image: "/placeholder.svg?height=80&width=80",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    marketCap: 2100000,
  },
  {
    id: "4",
    name: "Dave Coin",
    symbol: "DAVE",
    image: "/placeholder.svg?height=80&width=80",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    marketCap: 450000,
  },
  {
    id: "5",
    name: "Eve Token",
    symbol: "EVE",
    image: "/placeholder.svg?height=80&width=80",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    marketCap: 750000,
  },
  {
    id: "6",
    name: "Frank Coin",
    symbol: "FRANK",
    image: "/placeholder.svg?height=80&width=80",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    marketCap: 320000,
  },
];

export default function TokensPage() {
  const [sortBy, setSortBy] = useState("marketcap");
  const [tokens, setTokens] = useState(mockTokens);

  const handleLoadMore = () => {
    // Simulate loading more
    const moreTokens = [...mockTokens].map((token) => ({
      ...token,
      id: token.id + "_" + Date.now(),
      marketCap: Math.floor(Math.random() * 3000000) + 100000,
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ),
    }));
    setTokens((prev) => [...prev, ...moreTokens]);
  };

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-16 pb-20 md:pb-6">
      <div className="container mx-auto px-4 py-6">
        {/* Top Control Area */}
        <div className="flex items-center justify-between mb-6">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marketcap">By Market Cap</SelectItem>
              <SelectItem value="time">By Time</SelectItem>
            </SelectContent>
          </Select>

          <CreateTokenDialog />
        </div>

        {/* Token Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {tokens.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleLoadMore} className="gap-2">
            Load More
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

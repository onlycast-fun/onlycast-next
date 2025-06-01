"use client";
import { ChevronDown, Copy, LogOut, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatMarketCap, shortPubKey } from "@/lib/utils";
import { useUser } from "@/providers/user-provider";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { getClankerTokenPath } from "@/lib/clanker/path";

export function UserProfile() {
  const { user } = useUser();
  const tokens = user?.tokens || [];
  const { ready, authenticated, logout, user: privyUser, login } = usePrivy();
  const { wallet } = privyUser || {};
  const walletAddress = wallet?.address || "";

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success("Wallet address copied!");
    }
  };

  if (!ready) {
    return (
      <Button disabled variant="default" size="sm">
        Loading...
      </Button>
    );
  }

  if (!authenticated) {
    return (
      <Button onClick={login} variant="default" size="sm">
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">{shortPubKey(walletAddress)}</span>
          <span className="sm:hidden">{shortPubKey(walletAddress)}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Linked Wallet</p>
              <p className="text-xs leading-none text-muted-foreground">
                {shortPubKey(walletAddress)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* User Tokens Section */}
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          My Tokens ({tokens.length})
        </DropdownMenuLabel>

        {tokens.length > 0 ? (
          <div className="px-2 py-1 space-y-2 max-h-40 overflow-y-auto">
            {tokens.map((token) => (
              <div
                key={token.token_address}
                className="flex items-center justify-between p-2 rounded-md bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <Link
                    href={getClankerTokenPath(token.token_address)}
                    target="_blank"
                  >
                    <Badge
                      variant="secondary"
                      className="font-mono text-xs hover:underline"
                    >
                      ${token.symbol}
                    </Badge>
                  </Link>
                </div>
                <span className="text-xs font-medium text-primary">
                  {formatMarketCap(token.market_cap || 0)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-2 py-4 text-center">
            <p className="text-sm text-muted-foreground">
              No tokens created yet
            </p>
          </div>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logout} className="gap-2 text-destructive">
          <LogOut className="w-4 h-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

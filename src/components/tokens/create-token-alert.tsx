import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePrivy } from "@privy-io/react-auth";
import { AlertCircle, Info, Wallet } from "lucide-react";
import { Button } from "../ui/button";
import { useUserInfo } from "@/providers/userinfo-provider";
import { Token } from "@/types";
import Link from "next/link";
import { getClankerTokenPath } from "@/lib/clanker/path";
import { getFarcasterVerifiedAddressPath } from "@/lib/farcaster/path";
import { getUserPrimaryEthAddress } from "@/lib/farcaster/user";
import { shortPubKey } from "@/lib/utils";

export function CheckFcWalletAlert() {
  return (
    <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <AlertDescription className="text-red-800 dark:text-red-200">
        You need to link a wallet to your account to create tokens.{" "}
        <Link
          href={getFarcasterVerifiedAddressPath()}
          target="_blank"
          className="font-medium underline hover:no-underline"
        >
          Add a wallet to your Farcaster account
        </Link>
      </AlertDescription>
    </Alert>
  );
}

export function CheckUserLoginAlert({ login }: { login: () => void }) {
  return (
    <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <AlertDescription className="text-red-800 dark:text-red-200">
        You need to be logged in to create tokens.{" "}
        <Button onClick={login} size={"sm"}>
          Login
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export function CheckUserTokensAlert({ token }: { token: Token }) {
  return (
    <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      <AlertDescription className="text-orange-800 dark:text-orange-200">
        The current account has created ${token.symbol} token, and new tokens
        are not supported temporarily.{" "}
        <Link
          href={getClankerTokenPath(token.token_address)}
          target="_blank"
          className="font-medium underline hover:no-underline"
        >
          View token details
        </Link>
      </AlertDescription>
    </Alert>
  );
}

export function UsedWalletAlert({ address }: { address: string }) {
  return (
    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="text-blue-800 dark:text-blue-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="font-medium">Farcaster Primary Wallet:</span>
          </div>
          <div className="font-mono text-sm bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded border">
            <span className="max-sm:hidden">{address}</span>
            <span className="sm:hidden">{shortPubKey(address)}</span>
          </div>
          <p className="text-sm">
            We will use this wallet to create your token. Please confirm you
            want to use this wallet before proceeding.
          </p>
          <Link
            href={getFarcasterVerifiedAddressPath()}
            target="_blank"
            className="font-medium underline hover:no-underline"
          >
            Go to farcaster to confirm →
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export function CreateTokenAlert() {
  const { tokens, fcUser } = useUserInfo();
  const { authenticated, login } = usePrivy();
  const token = tokens?.[0];
  const fcWalletAddress = getUserPrimaryEthAddress(fcUser!);

  if (!authenticated) {
    return <CheckUserLoginAlert login={login} />;
  }

  if (!fcWalletAddress) {
    return <CheckFcWalletAlert />;
  }

  if (token) {
    return <CheckUserTokensAlert token={token} />;
  }
  return <UsedWalletAlert address={fcWalletAddress} />;
}

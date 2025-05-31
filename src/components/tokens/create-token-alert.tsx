import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePrivy } from "@privy-io/react-auth";
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useUser } from "@/providers/user-provider";
import { Token } from "@/types";
import Link from "next/link";
import { getClankerTokenPath } from "@/lib/clanker/path";

export function CheckLinkedWalletAlert({
  linkWallet,
}: {
  linkWallet: () => void;
}) {
  return (
    <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <AlertDescription className="text-red-800 dark:text-red-200">
        You need to link your wallet to create tokens.{" "}
        <Button onClick={linkWallet} size={"sm"}>
          Link Wallet
        </Button>
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

export function CreateTokenAlert() {
  const { user } = useUser();
  const { authenticated, login, user: privyUser, linkWallet } = usePrivy();
  const walletAddress = privyUser?.wallet?.address;
  const token = user?.tokens?.[0];

  if (!authenticated) {
    return <CheckUserLoginAlert login={login} />;
  }

  if (!walletAddress) {
    return <CheckLinkedWalletAlert linkWallet={linkWallet} />;
  }

  if (token) {
    return <CheckUserTokensAlert token={token} />;
  }
  return null;
}

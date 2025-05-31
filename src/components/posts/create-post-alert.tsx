import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/providers/user-provider";
import { usePrivy } from "@privy-io/react-auth";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { CreateTokenDialogWithLink } from "../tokens/create-token-dialog";

export function CheckUserTokensAlert() {
  return (
    <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      <AlertDescription className="text-orange-800 dark:text-orange-200">
        You need to create a token before you can post content.{" "}
        <CreateTokenDialogWithLink text="Create your first token" />
      </AlertDescription>
    </Alert>
  );
}

export function CheckLinkedWalletAlert({
  linkWallet,
}: {
  linkWallet: () => void;
}) {
  return (
    <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <AlertDescription className="text-red-800 dark:text-red-200">
        You need to link your wallet to create posts.{" "}
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
        You need to be logged in to create posts.{" "}
        <Button onClick={login} size={"sm"}>
          Login
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export function CreatePostAlert() {
  const { user } = useUser();
  const { authenticated, login, user: privyUser, linkWallet } = usePrivy();
  const walletAddress = privyUser?.wallet?.address;
  const hasTokens = (user?.tokens?.length ?? 0) > 0;

  if (!authenticated) {
    return <CheckUserLoginAlert login={login} />;
  }

  if (!walletAddress) {
    return <CheckLinkedWalletAlert linkWallet={linkWallet} />;
  }

  if (!hasTokens) {
    return <CheckUserTokensAlert />;
  }

  return null;
}

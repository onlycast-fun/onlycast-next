import { useUser } from "@/providers/user-provider";
import { usePrivy } from "@privy-io/react-auth";

export function useCheckPostActions() {
  const { authenticated, login, linkWallet, user: privyUser } = usePrivy();
  const wallet = privyUser?.wallet;

  const { user } = useUser();
  const hasTokens = (user?.tokens?.length ?? 0) > 0;

  const canCreatePost = authenticated && wallet && hasTokens;

  return { canCreatePost };
}

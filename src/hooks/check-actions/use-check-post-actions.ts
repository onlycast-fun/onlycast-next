import { usePrivy } from "@privy-io/react-auth";

export function useCheckPostActions() {
  const { authenticated, login, linkWallet, user } = usePrivy();
  const wallet = user?.wallet;

  const checkCreatePost = () => {
    if (!authenticated) {
      login();
      return false;
    }
    if (!wallet) {
      linkWallet();
      return false;
    }
    return true;
  };

  return { checkCreatePost };
}

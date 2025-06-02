import { usePrivy, useUser, WalletWithMetadata } from "@privy-io/react-auth";

export function useUserWallet() {
  const { user } = useUser();
  const linkedExternalWallet = user?.linkedAccounts.find(
    (account) =>
      account.type === "wallet" && account.connectorType !== "embedded"
  ) as WalletWithMetadata;
  const { linkWallet, unlinkWallet } = usePrivy();
  return {
    linkWallet,
    unlinkWallet,
    linkedExternalWallet,
  };
}

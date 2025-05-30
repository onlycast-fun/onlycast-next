import { useFarcasterSigner, usePrivy, useWallets } from "@privy-io/react-auth";

export function useFarcasterAccount() {
  const { user, linkFarcaster } = usePrivy();
  const { requestFarcasterSignerFromWarpcast } = useFarcasterSigner();
  const { wallets } = useWallets();
  const embededWallet = wallets.find(
    (wallet) => wallet.connectorType === "embedded"
  );

  const farcasterAccount = user?.linkedAccounts.find(
    (account) => account.type === "farcaster"
  );
  const signerPublicKey = user?.farcaster?.signerPublicKey;

  return {
    farcasterAccount,
    signerPublicKey,
    embededWallet,
    linkFarcaster,
    requestFarcasterSignerFromWarpcast,
  };
}

const CLANKER_HOST = "https://www.clanker.world";

export const getClankerTokenPath = (tokenAddress: string) => {
  return `${CLANKER_HOST}/clanker/${tokenAddress}`;
};

const FC_HOST = "https://farcaster.xyz";
export const getFarcasterUserPath = (fname: string) => {
  return `${FC_HOST}/${fname}`;
};
export const getFarcasterChannelPath = (channelId: string) => {
  return `${FC_HOST}/~/channel/${channelId}`;
};

export const getFarcasterVerifiedAddressPath = () => {
  return `${FC_HOST}/~/settings/verified-addresses`;
};

export const getFarcasterCastPath = (fname: string, hash: string) => {
  return `${FC_HOST}/${fname}/${hash}`;
};

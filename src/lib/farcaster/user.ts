import { Author } from "@/types/neynar";

export const getUserPrimaryEthAddress = (user: Author) => {
  return user?.verified_addresses?.primary?.eth_address || "";
};

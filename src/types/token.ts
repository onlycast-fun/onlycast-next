export enum ContractType {
  ERC20 = "ERC20",
  ERC721 = "ERC721",
}

export enum StorageType {
  BALANCE = "BALANCE",
}

export type Token = {
  name: string;
  symbol: string;
  image: string;
  token_address: string;
  creator_address: string;
  market_cap: number;
  created_at?: Date;
};

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
  contractAddress: string;
  creatorAddress: string;
  createdAt?: Date;
};

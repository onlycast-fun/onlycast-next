import { Author } from "./neynar";
import { Token } from "./token";

export type LeaderboardItemData = {
  user: Author;
  token: Token;
  score: number;
  rank: number;
};

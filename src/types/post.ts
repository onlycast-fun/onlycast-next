import { FarcasterUser } from "./farcaster";
import { TwitterUser } from "./twitter";
import { Token } from "./token";
import { NeynarCast } from "./neynar";

export type Post = {
  token?: Token;
  cast: NeynarCast;
};

export type Reveal = {
  revealHash: string;
  input: string;
  phrase?: string;
  signature?: string;
  address?: string;
  revealedAt: string;
};

export type Relationship = {
  target: string;
  targetAccount: string;
  targetId: string;
  farcaster?: FarcasterUser;
  twitter?: TwitterUser;
};

export type ConversationPost = Post & {
  direct_replies: Array<ConversationPost>;
};

export type RevealArgs = {
  hash: string;
  message: string;
  phrase: string;
  signature: string;
  address: string;
};

export type PostData = {
  text: string | null;
  reply: string | null;
  links: string[];
  images: string[];
};

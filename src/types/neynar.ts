export type NeynarCast = {
  object: "cast";
  hash: string;
  thread_hash: string;
  parent_hash: any;
  parent_url: any;
  root_parent_url: any;
  parent_author: {
    fid: any;
  };
  author: Author;
  channel: NeynarChannel;
  text: string;
  timestamp: string;
  embeds: any[];
  reactions: {
    likes_count: number;
    recasts_count: number;
    likes: Array<{ fid: number; fname: string }>;
    recasts: Array<{ fid: number; fname: string }>;
  };
  replies: {
    count: number;
  };
  mentioned_profiles: Author[];
  frames?: NeynarFrame[];
  viewer_context?: {
    liked: boolean;
    recasted: boolean;
  };
  author_channel_context: {
    following: boolean;
    role: string;
  };
};

export type NeynarFrame = {
  version: string;
  title: string;
  image: string;
  image_aspect_ratio: string;
  buttons: Array<{
    index: number;
    title?: string;
    action_type: string;
    target?: string;
    post_url?: string;
  }>;
  input: {
    text?: string;
  };
  state: {
    serialized?: string;
  };
  post_url: string;
  frames_url: string;
};

export type Author = {
  object: "user";
  fid: number;
  username: string;
  display_name: string;
  custody_address: string;
  pfp_url: string;
  profile: {
    bio: {
      text: string;
      mentioned_profiles: string[];
    };
    location: {
      latitude: number;
      longitude: number;
      address: {
        city: string;
        state: string;
        state_code: string;
        country: string;
        country_code: string;
      };
    };
  };
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
    primary: {
      eth_address: string;
      sol_address: string;
    };
  };
  verified_accounts?: [
    {
      platform: "x";
      username: string;
    }
  ];
  power_badge: boolean;
  experimental: {
    neynar_user_score: number;
  };
  viewer_context: {
    following: boolean;
    followed_by: boolean;
    blocking: boolean;
    blocked_by: boolean;
  };
};

export type NeynarChannel = {
  id: string;
  url: string;
  name: string;
  description: string;
  follower_count: number;
  image_url: string;
  object: string;
  parent_url: string;
  lead: Author;
  created_at: string;
};

export type PageInfo = {
  cursor: string | null;
};

export type NeynarChannelsResp = {
  channels: NeynarChannel[];
  next: PageInfo;
};

export type ConversationCast = NeynarCast & {
  direct_replies: Array<ConversationCast>;
};

export type NeynarCastsResp = {
  casts: NeynarCast[];
  next: PageInfo;
};

import {
  ApiResponse,
  ConversationPost,
  FarcasterChannel,
  FarcasterUser,
  Post,
  RequestConfig,
  Token,
  UploadImageResponse,
} from "@/types";

export class RequestSdk {
  private apiUrl: string;
  private token: string | null = null;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public setToken(token: string) {
    this.token = token;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    const hasJson = contentType?.includes("application/json");
    const data = hasJson ? await response.json() : null;

    if (!response.ok) {
      return {
        error: {
          message:
            data?.message ||
            data?.error ||
            `API error: ${response.status} ${response.statusText}`,
          status: response.status,
        },
      };
    }

    return { data };
  }

  public async request<T>(
    endpoint: string,
    config: RequestConfig & { maxRetries?: number } = {}
  ): Promise<ApiResponse<T>> {
    const {
      headers = {},
      maxRetries = 1,
      isFormData = false,
      ...options
    } = config;

    const defaultHeaders: Record<string, string> = {
      Accept: "application/json",
    };

    if (!isFormData) {
      defaultHeaders["Content-Type"] = "application/json";
    }

    const finalHeaders = {
      ...defaultHeaders,
      ...headers,
    };

    if (this.token) {
      finalHeaders.Authorization = `Bearer ${this.token}`;
    }

    let attempt = 1;
    while (true) {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        ...options,
        headers: finalHeaders,
      });

      if (!response.ok && attempt < maxRetries) {
        attempt++;
        continue;
      }

      const result = await this.handleResponse<T>(response);

      return result;
    }
  }

  async getTrendingFeed(fid: number) {
    return await this.request<{ data: Array<Post> }>(`/feeds/${fid}/trending`);
  }

  async getNewFeed(fid: number, page = 1) {
    return await this.request<{ data: Array<Post> }>(
      `/feeds/${fid}/new?page=${page}`
    );
  }

  async getPost(hash: string) {
    return await this.request<Post>(`/posts/${hash}`);
  }

  async getPostConversations(hash: string) {
    return await this.request<{ data: Array<ConversationPost> }>(
      `/posts/${hash}/conversations`
    );
  }

  async getFarcasterCast(identifier: string) {
    return await this.request<Post>(
      `/farcaster/casts?identifier=${identifier}`
    );
  }

  async getFarcasterIdentity(address: string) {
    return await this.request<FarcasterUser>(
      `/farcaster/identities?address=${address}`
    );
  }

  async getFarcasterUser(fid: number) {
    return await this.request<FarcasterUser>(`/farcaster/users/${fid}`);
  }

  async getFarcasterChannel(channelId: string) {
    return await this.request<FarcasterChannel>(
      `/farcaster/channels/${channelId}`
    );
  }

  async getUserTokens() {
    return await this.request<{ data: Token[] }>("/users/tokens");
  }

  async getToken(id: string) {
    return await this.request<Token>(`/tokens/${id}`);
  }

  async addToken(data: {
    name: string;
    symbol: string;
    image: string;
    metadata?: {
      description?: string;
      socialMediaUrls?: string[];
      auditUrls?: string[];
    };
    vault?: { percentage: number; durationInDays: number };
  }) {
    return await this.request<Token>(`/tokens`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getNotifications() {
    if (!this.token) {
      return { error: { message: "No token", status: 401 } };
    }
    return await this.request<{ data: Array<Post> }>(`/auth/notifications`);
  }

  async checkFnameAvailability(fname: string) {
    return await this.request<{ available: boolean }>(
      `/farcaster/fname-availability?fname=${fname}`
    );
  }

  async getLeaderboard(
    timeframe: "all-time" | "week" | "last-week",
    community?: string
  ) {
    return await this.request<{
      data: {
        score: number;
        posts: number;
        likes: number;
        replies: number;
      }[];
    }>(
      `/leaderboard?timeframe=${timeframe}${
        community ? `&community=${community}` : ""
      }`
    );
  }
}

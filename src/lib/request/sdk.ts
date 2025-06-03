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
import { LeaderboardItemData } from "@/types/leaderboard";

export class RequestSdk {
  private apiUrl: string;
  private authToken: string | null = null;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  public setAuthToken(token: string) {
    this.authToken = token;
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

    if (this.authToken) {
      finalHeaders.Authorization = `Bearer ${this.authToken}`;
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

  async getTrendingFeed(pageParam: { cursor?: string; limit?: number }) {
    const params = new URLSearchParams();
    if (pageParam.cursor) params.append("cursor", pageParam.cursor);
    if (pageParam.limit !== undefined)
      params.append("limit", String(pageParam.limit));
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return await this.request<{ data: { data: Array<Post>; next: string } }>(
      `/feeds${queryString}`
    );
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

  async getFarcasterChannel(channelId: string) {
    return await this.request<FarcasterChannel>(
      `/farcaster/channels/${channelId}`
    );
  }

  async getUserTokens() {
    return await this.request<{ data: Token[] }>("/users/tokens");
  }

  async getTokens(pageParam: { page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (pageParam.page) params.append("page", String(pageParam.page));
    if (pageParam.limit !== undefined)
      params.append("limit", String(pageParam.limit));
    return await this.request<{ data: Token[] }>(
      "/tokens?" + params.toString()
    );
  }

  async getToken(id: string) {
    return await this.request<Token>(`/tokens/${id}`);
  }

  async addToken(data: {
    creatorAddress: string;
    name: string;
    symbol: string;
    image: string;
    metadata?: {
      description?: string;
      socialMediaUrls?: string[];
      auditUrls?: string[];
    };
    vault?: { percentage?: number; durationInDays?: number };
  }) {
    return await this.request<{ data: Token }>(`/tokens`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getNotifications() {
    if (!this.authToken) {
      return { error: { message: "No auth token", status: 401 } };
    }
    return await this.request<{ data: Array<Post> }>(`/auth/notifications`);
  }

  async checkFnameAvailability(fname: string) {
    return await this.request<{ available: boolean }>(
      `/farcaster/fname-availability?fname=${fname}`
    );
  }

  async getLeaderboards() {
    return await this.request<{ data: LeaderboardItemData[] }>("/leaderboards");
  }
}

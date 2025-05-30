import { useRequestSDK } from "@/providers/request-sdk-provider";
import { Post } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useTrendingPosts({
  fid,
  filter,
}: {
  fid: number;
  filter?: (cast: Post) => boolean;
}) {
  const { sdk } = useRequestSDK();
  return useQuery({
    queryKey: ["trending-posts", fid],
    queryFn: async () => {
      const response = await sdk.getTrendingFeed(fid);
      const posts = response?.data?.data || [];
      if (filter) {
        return posts.filter(filter);
      }
      return posts;
    },
  });
}

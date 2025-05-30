import { useRequestSDK } from "@/providers/request-sdk-provider";
import { Post } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
const pageSize = 25;

export function useNewPosts({
  fid,
  filter,
  queryKey,
}: {
  fid: number;
  filter?: (cast: Post) => boolean;
  queryKey?: string;
}) {
  const { sdk } = useRequestSDK();
  return useInfiniteQuery<Post[]>({
    queryKey: ["new-posts", fid, queryKey],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const response = await sdk.getNewFeed(fid, pageParam as number);
      const posts = response?.data?.data || [];
      if (filter) {
        return posts.filter(filter);
      }
      return posts;
    },
    getNextPageParam: (lastPage: Post[], allPages: Post[][]) => {
      if (lastPage.length < pageSize) return undefined;
      return allPages.length + 1;
    },
  });
}

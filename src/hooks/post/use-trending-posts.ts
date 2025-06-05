import { useRequestSDK } from "@/providers/request-sdk-provider";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useTrendingPosts(limit: number) {
  const { sdk } = useRequestSDK();

  return useInfiniteQuery({
    queryKey: ["trending-posts", limit], // 包含limit的查询键
    queryFn: async ({ pageParam }) => {
      const res = await sdk.getTrendingFeed({
        cursor: pageParam,
        limit: limit,
      });
      const resData = res?.data?.data;
      return {
        data: resData?.data || [],
        next: resData?.next || "", // 返回下一页游标
      };
    },
    initialPageParam: "", // 初始没有游标
    getNextPageParam: (lastPage) => {
      // 如果有下一页游标则返回，否则返回undefined表示结束
      return lastPage?.next || "";
    },
    getPreviousPageParam: (firstPage) => {
      // 如果需要向前分页（这里不需要）
      return undefined;
    },
    staleTime: 10 * 60 * 1000, // 10分钟缓存
    refetchOnWindowFocus: false, // 避免窗口聚焦时刷新
  });
}

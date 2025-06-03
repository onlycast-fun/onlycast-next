import { useRequestSDK } from "@/providers/request-sdk-provider";
import { useQuery } from "@tanstack/react-query";

export function useLeaderboards() {
  const { sdk } = useRequestSDK();

  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await sdk.getLeaderboards();
      const data = res.data?.data || [];
      return data;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

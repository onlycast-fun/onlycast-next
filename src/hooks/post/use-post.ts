import { useRequestSDK } from "@/providers/request-sdk-provider";
import { useQuery } from "@tanstack/react-query";

export function usePost({ hash }: { hash: string }) {
  const { sdk } = useRequestSDK();
  return useQuery({
    queryKey: ["post", hash],
    queryFn: async () => {
      const response = await sdk.getPost(hash);
      return response.data ?? null;
    },
  });
}

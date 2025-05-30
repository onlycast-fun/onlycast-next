import { useRequestSDK } from "@/providers/request-sdk-provider";
import { useQuery } from "@tanstack/react-query";

export function usePostConversation({ hash }: { hash: string }) {
  const { sdk } = useRequestSDK();
  return useQuery({
    queryKey: ["post-conversation", hash],
    queryFn: async () => {
      const response = await sdk.getPostConversations(hash);
      return response.data?.data ?? null;
    },
  });
}

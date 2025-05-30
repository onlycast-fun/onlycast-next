import { useRequestSDK } from "@/providers/request-sdk-provider";
import { useQuery } from "@tanstack/react-query";

export function useToken(args?: { chainId: number; address: string }) {
  const { sdk } = useRequestSDK();
  return useQuery({
    queryKey: ["token", args?.chainId, args?.address],
    queryFn: async () => {
      if (!args) return null;
      const response = await sdk.getToken(args.address);
      return response.data ?? null;
    },
    enabled: !!args,
  });
}

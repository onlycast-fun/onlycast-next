import { useRequestSDK } from "@/providers/request-sdk-provider";
import { useCallback, useState } from "react";
import { CreateTokenData } from "@/lib/schemas";

export function useCreateToken(creatorAddress: string) {
  const { sdk } = useRequestSDK();

  const [creating, setCreating] = useState(false);

  const create = useCallback(
    async (data: CreateTokenData) => {
      if (!creatorAddress) {
        throw new Error("Creator address is required");
      }
      try {
        setCreating(true);
        const res = await sdk.addToken({
          name: data.name,
          symbol: data.symbol,
          image: data.image,
          vault: {
            percentage: data.percentage,
            durationInDays: data.durationInDays,
          },
          creatorAddress,
        });
        const token = res.data?.data;
        if (!token) {
          throw new Error("Token creation failed");
        }
        return token;
      } catch (error) {
        console.error("Token creation failed:", error);
        throw error;
      } finally {
        setCreating(false);
      }
    },
    [sdk, creatorAddress]
  );

  return { create, creating };
}

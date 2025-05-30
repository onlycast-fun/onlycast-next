import { useRequestSDK } from "@/providers/request-sdk-provider";
import { useCallback, useState } from "react";
import { CreateTokenData } from "@/lib/schemas";

export function useCreateToken() {
  const { sdk } = useRequestSDK();

  const [creating, setCreating] = useState(false);

  const create = useCallback(
    async (data: CreateTokenData) => {
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
        });
        const { data: token } = res;
        if (!token) {
          throw new Error("Token creation failed");
        }
        console.log("Token created successfully:", token);
        return token;
      } catch (error) {
        console.error("Token creation failed:", error);
        throw error;
      } finally {
        setCreating(false);
      }
    },
    [sdk]
  );

  return { create, creating };
}

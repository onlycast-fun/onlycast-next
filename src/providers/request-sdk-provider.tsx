"use client";
import { API_URL } from "@/constants";
import { RequestSdk } from "@/lib/request/sdk";
import { usePrivy } from "@privy-io/react-auth";
import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
interface RequestSDKContextValue {
  sdk: RequestSdk;
}

export const RequestSDKContext = createContext<
  RequestSDKContextValue | undefined
>(undefined);

export const RequestSDKProvider = ({ children }: { children: ReactNode }) => {
  const sdk = useMemo(() => new RequestSdk(API_URL), []);
  const { authenticated, getAccessToken } = usePrivy();
  useEffect(() => {
    (async () => {
      if (authenticated) {
        const accessToken = await getAccessToken();
        sdk.setToken(accessToken!);
      } else {
        sdk.setToken("");
      }
    })();
  }, [authenticated, getAccessToken, sdk]);

  return (
    <RequestSDKContext.Provider value={{ sdk }}>
      {children}
    </RequestSDKContext.Provider>
  );
};
export const useRequestSDK = () => {
  const context = useContext(RequestSDKContext);
  if (!context) {
    throw new Error("useRequestSDK must be used within an RequestSDKProvider");
  }
  return context;
};

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
  useState,
} from "react";
interface RequestSDKContextValue {
  sdk: RequestSdk;
  sdkAuthed?: boolean;
}

export const RequestSDKContext = createContext<
  RequestSDKContextValue | undefined
>(undefined);

export const RequestSDKProvider = ({ children }: { children: ReactNode }) => {
  const sdk = useMemo(() => new RequestSdk(API_URL), []);
  const [sdkAuthed, setSdkAuthed] = useState(false);
  const { ready, authenticated, getAccessToken } = usePrivy();
  useEffect(() => {
    (async () => {
      if (!ready) return;
      if (authenticated) {
        const accessToken = await getAccessToken();
        sdk.setAuthToken(accessToken!);
        setSdkAuthed(true);
      } else {
        sdk.setAuthToken("");
        setSdkAuthed(false);
      }
    })();
  }, [ready, authenticated, getAccessToken, sdk]);

  return (
    <RequestSDKContext.Provider value={{ sdk, sdkAuthed }}>
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

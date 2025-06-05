"use client";

import { usePrivy } from "@privy-io/react-auth";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRequestSDK } from "./request-sdk-provider";
import { Token } from "@/types";
import { Author } from "@/types/neynar";
import { useFarcasterAccount } from "@/hooks/farcaster/use-farcaster-account";
import { getFcUsers } from "@/lib/request/neynarApi";

interface UserInfoContextType {
  tokens: Array<Token>;
  setTokens: Dispatch<SetStateAction<Array<Token>>>;
  fcUser: Author | null;
  setFcUser: Dispatch<SetStateAction<Author | null>>;
}

const UserInfoContext = createContext<UserInfoContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: ReactNode }) {
  const { farcasterAccount } = useFarcasterAccount();
  const fid = farcasterAccount?.fid;
  const [tokens, setTokens] = useState<Array<Token>>([]);
  const [fcUser, setFcUser] = useState<Author | null>(null);
  const { sdk, sdkAuthed } = useRequestSDK();
  useEffect(() => {
    if (sdkAuthed) {
      const fetchUserTokens = async () => {
        try {
          const res = await sdk.getUserTokens();
          setTokens(res?.data?.data || []);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setFcUser(null);
        }
      };
      fetchUserTokens();
    } else {
      setFcUser(null);
    }
  }, [sdkAuthed, sdk]);
  useEffect(() => {
    if (sdkAuthed && fid) {
      const fetchFcUser = async () => {
        try {
          const res = await getFcUsers([fid]);
          const user = res.users.find((u) => u.fid === fid);
          if (user) {
            setFcUser(user);
          } else {
            setFcUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch Farcaster user:", error);
          setFcUser(null);
        }
      };
      fetchFcUser();
    } else {
      setFcUser(null);
    }
  }, [sdkAuthed, sdk, fid]);

  return (
    <UserInfoContext.Provider value={{ tokens, setTokens, fcUser, setFcUser }}>
      {children}
    </UserInfoContext.Provider>
  );
}

export function useUserInfo() {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }
  return context;
}

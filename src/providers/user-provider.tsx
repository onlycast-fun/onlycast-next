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

interface User {
  tokens: Array<Token>;
}

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { sdk, sdkAuthed } = useRequestSDK();
  useEffect(() => {
    if (sdkAuthed) {
      const fetchUserTokens = async () => {
        try {
          const res = await sdk.getUserTokens();
          setUser({
            tokens: res?.data?.data || [],
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setUser(null);
        }
      };
      fetchUserTokens();
    } else {
      setUser(null);
    }
  }, [sdkAuthed, sdk]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

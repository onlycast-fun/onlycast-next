"use client";

import { PRIVY_APP_ID } from "@/constants/privy";
import { PrivyProvider } from "@privy-io/react-auth";
// dayjs
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ThemeProvider } from "./theme-provider";
import { RequestSDKProvider } from "./request-sdk-provider";
import { UserProvider } from "./user-provider";
dayjs.extend(relativeTime);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PrivyProvider
        appId={PRIVY_APP_ID}
        //   clientId="your-app-client-id"
        config={{
          loginMethods: ["farcaster"],
          embeddedWallets: {
            createOnLogin: "all-users",
          },
        }}
      >
        <RequestSDKProvider>
          <UserProvider>{children}</UserProvider>
        </RequestSDKProvider>
      </PrivyProvider>
    </ThemeProvider>
  );
}

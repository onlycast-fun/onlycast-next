"use client";

import { PRIVY_APP_ID } from "@/constants/privy";
import { PrivyProvider } from "@privy-io/react-auth";
// dayjs
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ThemeProvider } from "./theme-provider";
import { RequestSDKProvider } from "./request-sdk-provider";
import { UserProvider } from "./userinfo-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
dayjs.extend(relativeTime);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10分钟缓存
      retry: 2, // 失败时重试2次
      refetchOnWindowFocus: false, // 窗口聚焦时不自动刷新
    },
  },
});
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </ThemeProvider>
  );
}

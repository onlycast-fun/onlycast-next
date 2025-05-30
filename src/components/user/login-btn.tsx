"use client";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Button } from "../ui/button";

export function LoginBtn() {
  const { ready, authenticated, logout, getAccessToken, user } = usePrivy();
  const { login } = useLogin({
    onComplete: async (params) => {
      console.log(
        "🔑 ✅ Login success",
        params.isNewUser,
        params.wasAlreadyAuthenticated,
        params.user
      );
      // Get auth token after successful login
      const token = await getAccessToken();
      console.log("🔑 Token:", token);
    },
    onError(error) {
      console.log("🔑 🚨 Login error", { error });
    },
  });

  if (authenticated) {
    return <Button onClick={logout}>Logout</Button>;
  }

  return (
    <Button
      onClick={() => {
        login();
      }}
      disabled={!ready || authenticated}
    >
      Connect
    </Button>
  );
}

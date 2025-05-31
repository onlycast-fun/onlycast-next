import { useCallback, useMemo, useState } from "react";
import {
  useCreateWallet,
  useFarcasterSigner,
  usePrivy,
} from "@privy-io/react-auth";
import {
  HubRestAPIClient,
  ExternalEd25519Signer,
} from "@standard-crypto/farcaster-js";
import axios from "axios";
import { useFarcasterAccount } from "./use-farcaster-account";
import { FARCASTER_HUB_URL } from "@/constants";

export type SubmitCast = Parameters<HubRestAPIClient["submitCast"]>[0];

const hubClient = new HubRestAPIClient();
export function useFarcasterWrite() {
  const { user } = usePrivy();
  const fid = user?.farcaster?.fid;

  const { embededWallet } = useFarcasterAccount();
  const { getFarcasterSignerPublicKey, signFarcasterMessage } =
    useFarcasterSigner();
  const { createWallet } = useCreateWallet();

  const privySigner = useMemo(
    () =>
      new ExternalEd25519Signer(
        signFarcasterMessage,
        getFarcasterSignerPublicKey
      ),
    [signFarcasterMessage, getFarcasterSignerPublicKey]
  );

  const [writing, setWriting] = useState(false);

  const submitCast = async (data: SubmitCast) => {
    console.log("embededWallet", embededWallet);
    if (!fid) {
      throw new Error("fid is not found");
    }
    if (!embededWallet) {
      createWallet();
      return;
    }
    if (!privySigner) {
      throw new Error("Farcaster signer is not initialized");
    }
    console.log(await hubClient.getHubInfo());
    try {
      setWriting(true);
      console.log("data", data);
      console.log("fid", fid);
      console.log("privySigner", privySigner);
      const res = await hubClient.submitCast(data, fid, privySigner);
      console.log("Cast submitted successfully:", res);
      return res;
    } catch (error) {
      console.error("Error submitting cast:", error);
    } finally {
      setWriting(false);
    }
  };
  return { privySigner, submitCast, writing };
}

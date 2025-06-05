import { API_URL, ONLYCAST_HOST } from "@/constants";
import { RecordType } from "@/types/encrypted-record";

export const isEncryptedTextLink = (link: string) => {
  try {
    const url = new URL(link);
    return (
      url.hostname === "onlycast.fun" &&
      url.pathname.startsWith("/encrypted-records/text/")
    );
  } catch (error) {
    return false;
  }
};

export const isEncryptedImageLink = (link: string) => {
  try {
    const url = new URL(link);
    return (
      url.hostname === "onlycast.fun" &&
      url.pathname.startsWith("/encrypted-records/image/")
    );
  } catch (error) {
    return false;
  }
};

export const isEncryptedMixedContentLink = (link: string) => {
  try {
    const url = new URL(link);
    return (
      url.hostname === "onlycast.fun" &&
      url.pathname.startsWith("/encrypted-records/mixed/")
    );
  } catch (error) {
    return false;
  }
};

export const getEncryptedRecordPageLink = (
  arid: string,
  recordType: RecordType
) => {
  return `${ONLYCAST_HOST}/encrypted-records/${recordType}/${arid}`;
};

export const getAridWithPageLink = (link: string) => {
  const url = new URL(link);
  const arid = url.pathname.split("/").pop();
  return arid || "";
};

export const getDecryptApiWithArid = (arid: string) => {
  return `${API_URL}/encrypted-records/decrypt/${arid}`;
};

export const getDecryptionMixedContentApiWithArid = (arid: string) => {
  return `${API_URL}/encrypted-records/mixed/${arid}`;
};

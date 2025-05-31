import { API_URL, ONLYCAST_HOST } from "@/constants";

export const isEncryptedTextLink = (link: string) => {
  try {
    const url = new URL(link);
    return (
      url.hostname === "onlycast.fun" &&
      url.pathname.startsWith("/encrypteds/text/")
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
      url.pathname.startsWith("/encrypteds/image/")
    );
  } catch (error) {
    return false;
  }
};

export const getEncryptedTextPageLink = (arid: string) => {
  return `${ONLYCAST_HOST}/encrypteds/text/${arid}`;
};
export const getEncryptedImagePageLink = (arid: string) => {
  return `${ONLYCAST_HOST}/encrypteds/image/${arid}`;
};

export const getAridWithPageLink = (link: string) => {
  const url = new URL(link);
  const arid = url.pathname.split("/").pop();
  return arid || "";
};

export const getDecryptionTextApiWithArid = (arid: string) => {
  return `${API_URL}/encrypted-records/text/${arid}`;
};

export const getDecryptionImageApiWithArid = (arid: string) => {
  return `${API_URL}/encrypted-records/image/${arid}`;
};

export const getDecryptionTextApiWithPageLink = (link: string) => {
  const arid = getAridWithPageLink(link);
  return getDecryptionTextApiWithArid(arid);
};

export const getDecryptionImageApiWithPageLink = (link: string) => {
  const arid = getAridWithPageLink(link);
  return getDecryptionImageApiWithArid(arid);
};

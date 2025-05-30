export const FARCASTER_WEB_HOST = "https://farcaster.xyz";
export const FARCASTER_APP_HOST = "farcaster://";

export const embedsToQueryParams = (embeds?: string[]) => {
  return embeds && embeds.length > 0
    ? embeds.map((embed) => `embeds[]=${embed}`).join("&")
    : "";
};

export const openFarcasterCreateCast = async ({
  text,
  channelId,
  embeds,
}: {
  text: string;
  channelId?: string;
  embeds?: string[];
}) => {
  const embedsString = embedsToQueryParams(embeds);
  let params = `text=${text}${embedsString ? `&${embedsString}` : ""}`;
  if (channelId && channelId !== "home") {
    params += `&channelKey=${channelId}`;
  }
  const farcasterAppUrl = encodeURI(
    `${FARCASTER_APP_HOST}/~/compose?${params}`
  );
  const webUrl = encodeURI(`${FARCASTER_WEB_HOST}/~/compose?${params}`);

  // 判断是否为移动端
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // 移动端优先尝试打开 app，延迟后跳 web
    const timeout = setTimeout(() => {
      window.open(webUrl, "_blank");
    }, 1500);
    window.location.href = farcasterAppUrl;
    // 用户手动切回浏览器时清除定时器
    window.addEventListener("pagehide", () => clearTimeout(timeout), {
      once: true,
    });
  } else {
    // PC 端直接打开 web
    window.open(webUrl, "_blank");
  }
};

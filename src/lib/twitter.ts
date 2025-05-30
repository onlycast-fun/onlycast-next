export const TWITTER_WEB_HOST = "https://twitter.com";
export const TWITTER_APP_HOST = "twitter://";
export const TWITTER_SCREEN_NAME = "onlycastdot";

export const openTwitterCreateTweet = async (text: string, url?: string) => {
  const tweetText = text + (url ? ` ${url}` : "");
  const twitterAppUrl = `${TWITTER_APP_HOST}/post?message=${encodeURIComponent(
    tweetText
  )}`;
  const webUrl = `${TWITTER_WEB_HOST}/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}`;
  // 判断是否为移动端
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // 移动端优先尝试打开 app，延迟后跳 web
    const timeout = setTimeout(() => {
      window.open(webUrl, "_blank");
    }, 1500);
    window.location.href = twitterAppUrl;
    // 用户手动切回浏览器时清除定时器
    window.addEventListener("pagehide", () => clearTimeout(timeout), {
      once: true,
    });
  } else {
    // PC 端直接打开 web
    window.open(webUrl, "_blank");
  }
};

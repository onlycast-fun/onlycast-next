import { ImageResponse } from "next/og";

export async function getOgResponse({
  contentType,
  creatorToken,
  requiredAmount,
  creatorName,
}: {
  contentType: "text" | "image" | "mixed";
  creatorToken: string;
  requiredAmount: number;
  creatorName: string;
}) {
  try {
    // Validate content type - Updated to match current implementation
    const validTypes = ["text", "image", "mixed"];
    if (!validTypes.includes(contentType)) {
      return new Response("Invalid content type", { status: 400 });
    }

    const getContentTypeInfo = (type: string) => {
      switch (type) {
        case "text":
          return {
            icon: "📄",
            badgeText: "Text",
            description: "Premium text content",
          };
        case "image":
          return {
            icon: "🖼️",
            badgeText: "Image",
            description: "Premium image content",
          };
        case "mixed":
          return {
            icon: "📚",
            badgeText: "Mixed Content",
            description: "Premium mixed content",
          };
        default:
          return {
            icon: "📚",
            badgeText: "Content",
            description: "Premium content",
          };
      }
    };

    const contentInfo = getContentTypeInfo(contentType);

    return new ImageResponse(
      (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(241, 245, 249, 0.9)", // muted/90
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Top Badges Row - Matching unlock-overlay positioning */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              right: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {/* Content Type Badge with Icon - Matching theme colors */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.8)", // background/80
                color: "#0f172a", // foreground
                padding: "16px 24px",
                borderRadius: "16px",
                border: "1px solid #e2e8f0", // border
                fontSize: "32px",
                fontWeight: "500",
              }}
            >
              <span style={{ fontSize: "24px" }}>{contentInfo.icon}</span>
              <span>{contentInfo.badgeText}</span>
            </div>

            {/* Premium Badge - Matching gradient */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "linear-gradient(45deg, #eab308, #ea580c)", // yellow-500 to orange-500
                color: "white",
                padding: "16px 24px",
                borderRadius: "16px",
                fontSize: "32px",
                fontWeight: "600",
              }}
            >
              <span>Premium</span>
            </div>
          </div>

          {/* Lock Icon - Positioned in upper-center with 50% opacity like unlock-overlay */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "60px", // Account for top badges
            }}
          >
            <span
              style={{
                fontSize: "100px",
                color: "#64748b", // muted-foreground/50
                opacity: 0.5,
              }}
            >
              🔒
            </span>
          </div>

          {/* Button Container - Full width with border, matching unlock-overlay */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: "16px",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            <div
              style={{
                width: "100%",
                border: "1px solid #e2e8f0", // border
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.5)", // background/50
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {/* Main Button - Pill-shaped like unlock-overlay */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  backgroundColor: "#f97316", // primary (orange)
                  color: "white", // primary-foreground
                  padding: "16px 32px",
                  borderRadius: "50px", // Full pill shape
                  fontSize: "48px",
                  fontWeight: "600",
                  width: "100%",
                  justifyContent: "center",
                  minHeight: "60px", // h-12 equivalent
                }}
              >
                <span style={{ fontSize: "48px", color: "#fbbf24" }}>🪙</span>
                <span>
                  Hold {requiredAmount} ${creatorToken} to unlock
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

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
    // Validate content type
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
            requirementText: `Hold ${requiredAmount} $${creatorToken} tokens to read this content`,
          };
        case "image":
          return {
            icon: "🖼️",
            badgeText: "Image",
            requirementText: `Hold ${requiredAmount} $${creatorToken} tokens to view this image`,
          };
        case "mixed":
          return {
            icon: "📚",
            badgeText: "Mixed Content",
            requirementText: `Hold ${requiredAmount} $${creatorToken} tokens to unlock this content`,
          };
        default:
          return {
            icon: "📚",
            badgeText: "Content",
            requirementText: `Hold ${requiredAmount} $${creatorToken} tokens to unlock`,
          };
      }
    };

    const contentInfo = getContentTypeInfo(contentType);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f1f5f9", // Light muted background
            backgroundImage: "linear-gradient(45deg, #f1f5f9 0%, #e2e8f0 100%)",
            position: "relative",
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                "radial-gradient(circle at 25% 25%, #cbd5e1 1px, transparent 1px)",
              backgroundSize: "50px 50px",
              opacity: 0.3,
              display: "flex",
            }}
          />

          {/* Top Badges */}
          <div
            style={{
              position: "absolute",
              top: 48,
              left: 48,
              right: 48,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {/* Content Type Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                color: "#0f172a",
                padding: "12px 20px",
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              <span style={{ fontSize: "18px" }}>{contentInfo.icon}</span>
              <span>{contentInfo.badgeText}</span>
            </div>

            {/* Premium Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "linear-gradient(45deg, #f59e0b, #ea580c)",
                color: "white",
                padding: "12px 20px",
                borderRadius: "20px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              <span style={{ fontSize: "18px" }}>⭐</span>
              <span>Premium</span>
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: "48px",
            }}
          >
            {/* Lock Icon - More subtle */}
            <div
              style={{
                position: "relative",
                width: "120px",
                height: "120px",
                borderRadius: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{ fontSize: "64px", color: "#64748b", opacity: 0.5 }}
              >
                🔒
              </span>
            </div>

            {/* Button Container - Matching new design */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "24px",
                width: "600px",
                maxWidth: "90%",
              }}
            >
              {/* Button Container with Border */}
              <div
                style={{
                  width: "100%",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "24px",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {/* Token Requirement */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    backgroundColor: "#f97316",
                    color: "white",
                    padding: "16px 32px",
                    borderRadius: "50px",
                    fontSize: "20px",
                    fontWeight: "600",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "20px", color: "#fbbf24" }}>🪙</span>
                  <span>
                    Hold {requiredAmount} ${creatorToken} to unlock
                  </span>
                </div>
              </div>

              {/* Requirement Text */}
              <div
                style={{
                  color: "#475569",
                  fontSize: "18px",
                  fontWeight: "500",
                  maxWidth: "500px",
                  lineHeight: 1.4,
                  textAlign: "center",
                  display: "flex",
                }}
              >
                {contentInfo.requirementText}
              </div>

              {/* Creator Info */}
              <div
                style={{
                  color: "#64748b",
                  fontSize: "16px",
                  fontWeight: "400",
                  display: "flex",
                }}
              >
                by {creatorName}
              </div>

              {/* Action Text */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#475569",
                  fontSize: "16px",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                }}
              >
                <span>👁️</span>
                <span>Visit OnlyCast to unlock</span>
              </div>
            </div>
          </div>

          {/* Corner Decorations - More subtle */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              width: "40px",
              height: "40px",
              border: "2px solid rgba(148, 163, 184, 0.3)",
              borderRight: "none",
              borderBottom: "none",
              borderTopLeftRadius: "8px",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              width: "40px",
              height: "40px",
              border: "2px solid rgba(148, 163, 184, 0.3)",
              borderLeft: "none",
              borderBottom: "none",
              borderTopRightRadius: "8px",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              width: "40px",
              height: "40px",
              border: "2px solid rgba(148, 163, 184, 0.3)",
              borderRight: "none",
              borderTop: "none",
              borderBottomLeftRadius: "8px",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              width: "40px",
              height: "40px",
              border: "2px solid rgba(148, 163, 184, 0.3)",
              borderLeft: "none",
              borderTop: "none",
              borderBottomRightRadius: "8px",
              display: "flex",
            }}
          />

          {/* OnlyCast Branding */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#64748b",
              fontSize: "16px",
              fontWeight: "600",
              display: "flex",
            }}
          >
            OnlyCast
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

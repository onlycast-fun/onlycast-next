import { NextRequest } from "next/server";
import satori from "satori";
import sharp from "sharp";
import { join } from "path";
import * as fs from "fs";

const fontPath = join(process.cwd(), "Roboto-Regular.ttf");
const fontData = fs.readFileSync(fontPath);
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ arid: string }> }
) {
  const svg = await satori(
    <div tw="absolute inset-0 bg-neutral-400 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-neutral-500">
      <p tw="text-white text-[60px] font-semibold mb-1">Click to view image</p>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Roboto",
          data: fontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

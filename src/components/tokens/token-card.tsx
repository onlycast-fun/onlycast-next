import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatMarketCap } from "@/lib/utils";

interface Token {
  id: string;
  name: string;
  symbol: string;
  image: string;
  createdAt: Date;
  marketCap: number;
}

interface TokenCardProps {
  token: Token;
}

export function TokenCard({ token }: TokenCardProps) {
  return (
    <Card className="w-full transition-all hover:shadow-md hover:scale-[1.02]">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Token Image */}
          <Avatar className="w-16 h-16 md:w-20 md:h-20">
            <AvatarImage
              src={token.image || "/placeholder.svg"}
              alt={token.name}
            />
            <AvatarFallback className="text-lg font-bold">
              {token.symbol[0]}
            </AvatarFallback>
          </Avatar>

          {/* Token Info */}
          <div className="space-y-2">
            <h3 className="font-bold text-lg">{token.name}</h3>
            <p className="text-sm text-muted-foreground font-mono">
              ${token.symbol}
            </p>
          </div>

          {/* Market Cap and Time */}
          <div className="space-y-1 w-full">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">MCAP</span>
              <span className="font-semibold text-primary">
                {formatMarketCap(token.marketCap)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Created</span>
              <span className="text-muted-foreground">
                {token.createdAt.toLocaleDateString("en-US")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

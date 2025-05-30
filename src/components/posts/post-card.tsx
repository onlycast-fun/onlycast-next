import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { EncryptedImage } from "@/components/encrypted-image";
import dayjs from "dayjs";

interface Post {
  id: string;
  creator: {
    name: string;
    avatar: string;
    token: string;
  };
  content: string;
  image?: string;
  createdAt: Date;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardContent className="p-4 md:p-6">
        {/* Creator Info */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={post.creator.avatar || "/placeholder.svg"}
              alt={post.creator.name}
            />
            <AvatarFallback>{post.creator.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-sm">{post.creator.name}</p>
            <p className="text-xs text-muted-foreground">
              {dayjs(post.createdAt).fromNow()}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-sm leading-relaxed">{post.content}</p>
        </div>

        {/* Encrypted Image */}
        {post.image && (
          <EncryptedImage
            src={post.image}
            alt="Post image"
            creatorToken={post.creator.token}
            className="w-full h-48 md:h-64"
          />
        )}
      </CardContent>
    </Card>
  );
}

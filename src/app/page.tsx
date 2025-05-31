"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostCard } from "@/components/posts/post-card";
import { CreatePostDialog } from "@/components/posts/create-post-dialog";
import { useTrendingPosts } from "@/hooks/post/use-trending-posts";

export default function PostsPage() {
  const [sortBy, setSortBy] = useState("latest");

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useTrendingPosts(15); // 每页15条
  const posts = data?.pages.flatMap((page) => page?.data) || [];

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Top Control Area */}
      <div className="flex items-center justify-between mb-6">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="hot">Hot</SelectItem>
          </SelectContent>
        </Select>

        <CreatePostDialog />
      </div>

      {/* Posts List */}
      <div className="space-y-4 mb-8">
        {posts.map((post) => (
          <PostCard key={post.cast.hash} token={post.token} cast={post.cast} />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            className="gap-2"
          >
            {isFetching || isFetchingNextPage ? (
              <>
                Loading...
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </>
            ) : (
              <>
                Load More
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

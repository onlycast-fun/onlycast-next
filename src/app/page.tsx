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

// Mock data
const mockPosts = [
  {
    id: "1",
    creator: {
      name: "Alice Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      token: "ALICE",
    },
    content:
      "Sharing some thoughts on blockchain technology today, especially its applications in decentralized social media. This image shows our latest architecture design.",
    image: "/placeholder.svg?height=300&width=400",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    creator: {
      name: "Bob Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      token: "BOB",
    },
    content:
      "Just completed a cool NFT project! This is an art collection our team spent 3 months creating.",
    image: "/placeholder.svg?height=300&width=400",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: "3",
    creator: {
      name: "Carol Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      token: "CAROL",
    },
    content:
      "The future of Web3 lies in users owning their own data and content. We're building a platform that truly belongs to creators.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
];

export default function PostsPage() {
  const [sortBy, setSortBy] = useState("latest");
  const [posts, setPosts] = useState(mockPosts);

  const handleLoadMore = () => {
    // Simulate loading more
    const morePosts = [...mockPosts].map((post) => ({
      ...post,
      id: post.id + "_" + Date.now(),
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    }));
    setPosts((prev) => [...prev, ...morePosts]);
  };

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-16 pb-20 md:pb-6">
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
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleLoadMore} className="gap-2">
            Load More
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

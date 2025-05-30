"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createPostSchema, type CreatePostData } from "@/lib/schemas";
import { useUploadEncryptedImage } from "@/hooks/use-upload-image";
import {
  SubmitCast,
  useFarcasterWrite,
} from "@/hooks/farcaster/use-farcaster-write";
import { openFarcasterCreateCast } from "@/lib/farcaster";
import { useCheckPostActions } from "@/hooks/check-actions/use-check-post-actions";

export function CreatePostDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
    },
  });
  const { upload, uploading } = useUploadEncryptedImage();
  const { submitCast, writing } = useFarcasterWrite();
  const { checkCreatePost } = useCheckPostActions();

  const onSubmit = async (data: CreatePostData) => {
    if (!checkCreatePost()) return;

    setIsSubmitting(true);

    try {
      let imageUrl: string | undefined;
      if (data.image) {
        const file = data.image;
        imageUrl = await upload(file);
      }
      const text = data.content.trim();
      const embedImages = [];
      if (imageUrl) {
        embedImages.push({
          url: imageUrl,
        });
      }
      const cast: SubmitCast = {
        text: text || "",
        embeds: [...embedImages],
      };
      openFarcasterCreateCast({
        text: cast.text,
        embeds: cast?.embeds?.map((embed) => embed.url || "") || [],
      });
      // const res = await submitCast(cast);
      // if (!res?.hash) {
      //   throw new Error("Failed to submit cast");
      // }
      toast.success("Post created successfully!");
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Creation failed, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Image (Optional)</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag image here or click to upload
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        className="hidden"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.querySelector(
                            'input[type="file"]'
                          ) as HTMLInputElement;
                          input?.click();
                        }}
                      >
                        Choose File
                      </Button>
                      {value && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Selected: {value.name}
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

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
import { usePrivy } from "@privy-io/react-auth";
import { useUser } from "@/providers/user-provider";
import { CreatePostAlert } from "./create-post-alert";
import { EncryptedImageUpload } from "./encrypted-image-upload";
import Link from "next/link";
import { useUploadEncryptedText } from "@/hooks/use-upload-text";
import { useUploadMultipleContent } from "@/hooks/use-upload-multiple-content";
import { UnencryptedJsonType } from "@/types/encrypted-record";

export function CreatePostDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <CreatePostContent setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

function CreatePostContent({ setOpen }: { setOpen: (open: boolean) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      description: "",
      encryptedContent: "",
      encryptedImage: undefined,
    },
  });
  const { upload: uploadText, uploading: uploadingText } =
    useUploadEncryptedText();
  const { upload: uploadImage, uploading: uploadingImage } =
    useUploadEncryptedImage();
  const { upload: uploadMultiContent, uploading: uploadingMultiContent } =
    useUploadMultipleContent();
  const { submitCast, writing } = useFarcasterWrite();
  const { canCreatePost } = useCheckPostActions();

  const onSubmit = async (data: CreatePostData) => {
    if (!canCreatePost) return;

    setIsSubmitting(true);

    try {
      let textPageLink: string | undefined;
      let textArId: string | undefined;
      if (data.encryptedContent) {
        const text = data.encryptedContent;
        const { arId, pageLink } = await uploadText(text);
        textPageLink = pageLink;
        textArId = arId;
      }
      let imagePageLink: string | undefined;
      let imageArId: string | undefined;
      if (data.encryptedImage) {
        const file = data.encryptedImage;
        const { arId, pageLink } = await uploadImage(file);
        imagePageLink = pageLink;
        imageArId = arId;
      }

      // publish to Farcaster
      const text = data.description.trim();
      const embeds = [];

      if (!!textArId && !!imageArId) {
        const { pageLink } = await uploadMultiContent({
          type: UnencryptedJsonType.emc,
          text_ar_id: textArId,
          image_ar_id: imageArId,
        });
        embeds.push({
          url: pageLink,
        });
      } else {
        if (textPageLink) {
          embeds.push({
            url: textPageLink,
          });
        }
        if (imagePageLink) {
          embeds.push({
            url: imagePageLink,
          });
        }
      }

      const cast: SubmitCast = {
        text: text || "",
        embeds: [...embeds],
      };
      openFarcasterCreateCast({
        text: cast.text,
        embeds: cast?.embeds?.map((embed) => embed.url || "") || [],
      });
      return;
      // const res = await submitCast(cast);
      // if (res?.hash) {
      //   toast.success(
      //     <div>
      //       Post created successfully!{" "}
      //       <Link
      //         href={`/posts/${res.hash}`}
      //         className="text-primary hover:underline"
      //       >
      //         View Post
      //       </Link>
      //     </div>,
      //     {
      //       position: "top-center",
      //     }
      //   );
      //   setOpen(false);
      //   form.reset();
      // } else {
      //   toast.error("Post creation failed, please try again");
      // }
    } catch (error) {
      toast.error("Creation failed, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      {" "}
      <DialogHeader>
        <DialogTitle>Create New Post</DialogTitle>
      </DialogHeader>
      <CreatePostAlert />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Say something to remind us not to miss it..."
                    className="min-h-[120px] resize-none"
                    disabled={!canCreatePost || isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="encryptedContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Encrypted Content (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={`Record your exclusive news... \r\nOnly users who hold your token can view this content`}
                    className="min-h-[200px] resize-none border-primary"
                    disabled={!canCreatePost || isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="encryptedImage"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Encrypted Image (Optional)</FormLabel>
                <FormControl>
                  <EncryptedImageUpload
                    value={value}
                    onChange={onChange}
                    disabled={!canCreatePost || isSubmitting}
                  />
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
            <Button type="submit" disabled={!canCreatePost || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

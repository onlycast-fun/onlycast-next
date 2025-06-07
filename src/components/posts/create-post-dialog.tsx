"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Plus,
  Lock,
  ChevronDown,
  ChevronRight,
  FileText,
  ImageIcon,
} from "lucide-react";
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
import { CreatePostAlert } from "./create-post-alert";
import { EncryptedImageUpload } from "./encrypted-image-upload";
import { useUploadEncryptedText } from "@/hooks/use-upload-text";
import { useUploadMixedContent } from "@/hooks/use-upload-mixed-content";
import { UnencryptedJsonType } from "@/types/encrypted-record";
import { usePrivy } from "@privy-io/react-auth";
import { useUserInfo } from "@/providers/userinfo-provider";

export function CreatePostDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Publish
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <CreatePostContent setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

function CreatePostContent({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { authenticated } = usePrivy();
  const { tokens } = useUserInfo();
  const hasTokens = (tokens?.length ?? 0) > 0;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const form = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      description: "Premium content for token holders",
      encryptedContent: "",
      encryptedImage: undefined,
    },
  });

  // Watch form values to check if at least one encrypted content is provided
  const encryptedContent = form.watch("encryptedContent");
  const encryptedImage = form.watch("encryptedImage");
  const hasEncryptedContent =
    (isTextExpanded && encryptedContent) || (isImageExpanded && encryptedImage);

  const { upload: uploadText, uploading: uploadingText } =
    useUploadEncryptedText();
  const { upload: uploadImage, uploading: uploadingImage } =
    useUploadEncryptedImage();
  const { upload: uploadMultiContent, uploading: uploadingMultiContent } =
    useUploadMixedContent();
  // const { submitCast, writing } = useFarcasterWrite();

  const disabled = !authenticated || !hasTokens || isSubmitting;
  const onSubmit = async (data: CreatePostData) => {
    setIsSubmitting(true);

    try {
      // 并行上传 text 和 image
      const textPromise = data.encryptedContent
        ? uploadText(data.encryptedContent, data.description)
        : Promise.resolve(undefined);

      const imagePromise = data.encryptedImage
        ? uploadImage(data.encryptedImage, data.description)
        : Promise.resolve(undefined);

      const [textResult, imageResult] = await Promise.all([
        textPromise,
        imagePromise,
      ]);

      let textPageLink: string | undefined;
      let textArId: string | undefined;
      if (textResult) {
        textPageLink = textResult.pageLink;
        textArId = textResult.arId;
      }

      let imagePageLink: string | undefined;
      let imageArId: string | undefined;
      if (imageResult) {
        imagePageLink = imageResult.pageLink;
        imageArId = imageResult.arId;
      }

      // publish to Farcaster
      const text = data.description.trim();
      const embeds = [];

      if (!!textArId && !!imageArId) {
        const { pageLink } = await uploadMultiContent(
          {
            type: UnencryptedJsonType.mc,
            text_ar_id: textArId,
            image_ar_id: imageArId,
          },
          data.description
        );
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

  const handleTextToggle = () => {
    if (disabled) return;
    setIsTextExpanded(!isTextExpanded);
    // if (!isTextExpanded) {
    //   // Clear the field when collapsing
    //   form.setValue("encryptedContent", "");
    // }
  };

  const handleImageToggle = () => {
    if (disabled) return;
    setIsImageExpanded(!isImageExpanded);
    // if (!isImageExpanded) {
    //   // Clear the field when collapsing
    //   form.setValue("encryptedImage", undefined);
    // }
  };
  return (
    <>
      <DialogHeader className="bg-background pb-4">
        <DialogTitle>Publish</DialogTitle>
      </DialogHeader>

      <div className="space-y-6 px-1 max-h-[85vh] overflow-y-auto">
        <CreatePostAlert />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Premium Content Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold">Premium Content</h3>
              </div>

              <div className="border border-dashed border-primary/25 rounded-lg p-4 space-y-4 bg-primary/5">
                <p className="text-sm text-muted-foreground text-center">
                  Viewable by token holders only
                </p>

                {/* Premium Text */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleTextToggle}
                    disabled={disabled}
                    className="w-full justify-between p-3 h-auto border border-border hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Text</span>
                      <span className="text-xs text-muted-foreground">
                        (Optional)
                      </span>
                    </div>
                    {isTextExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>

                  {isTextExpanded && (
                    <FormField
                      control={form.control}
                      name="encryptedContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder={
                                disabled
                                  ? "Connect wallet and create a token to add premium text..."
                                  : "Write your premium text content here..."
                              }
                              className="min-h-[120px] max-h-[200px] resize-none"
                              disabled={disabled}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Premium Image */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleImageToggle}
                    disabled={disabled}
                    className="w-full justify-between p-3 h-auto border border-border hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="font-medium">Image</span>
                      <span className="text-xs text-muted-foreground">
                        (Optional)
                      </span>
                    </div>
                    {isImageExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>

                  {isImageExpanded && (
                    <FormField
                      control={form.control}
                      name="encryptedImage"
                      render={({ field: { value, onChange } }) => (
                        <FormItem>
                          <FormControl>
                            <EncryptedImageUpload
                              value={value}
                              onChange={onChange}
                              disabled={disabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Validation Message */}
                {!hasEncryptedContent && !disabled && (
                  <p className="text-xs text-destructive text-center">
                    Please add at least one type of premium content
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">
                    Description <span className="text-xs">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[80px] max-h-[120px] resize-none text-sm"
                      disabled={disabled}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {`Briefly describe your premium content...`}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 sticky bottom-0 bg-background">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={disabled || !hasEncryptedContent}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Creating..." : "Publish to farcaster"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

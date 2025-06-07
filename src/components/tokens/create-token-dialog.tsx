"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronRight, Plus, Settings } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { createTokenSchema, type CreateTokenData } from "@/lib/schemas";
import { useCreateToken } from "@/hooks/token/use-create-token";
import { usePrivy } from "@privy-io/react-auth";
import { CreateTokenAlert } from "./create-token-alert";
import Link from "next/link";
import { getClankerTokenPath } from "@/lib/clanker/path";
import { useUserWallet } from "@/hooks/wallet/useUserWallet";
import { useUserInfo } from "@/providers/userinfo-provider";
import { getUserPrimaryEthAddress } from "@/lib/farcaster/user";
import { ImageUpload } from "./image-upload";
import { cn } from "@/lib/utils";
import { useRequestSDK } from "@/providers/request-sdk-provider";

export function CreateTokenDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Token
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <CreateTokenContent setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

export function CreateTokenDialogWithLink({ text }: { text?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Link className="font-medium underline hover:no-underline" href={""}>
          {text || "Create Token"}
        </Link>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <CreateTokenContent setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

export function CreateTokenContent({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { sdk } = useRequestSDK();
  const { authenticated } = usePrivy();
  const { tokens, setTokens, fcUser } = useUserInfo();
  const fcWalletAddress = getUserPrimaryEthAddress(fcUser!);
  const hasTokens = (tokens?.length ?? 0) > 0;
  const [isVaultSettingsExpanded, setIsVaultSettingsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTokenData>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      name: "",
      symbol: "",
      percentage: 0,
      durationInDays: 0,
    },
  });

  // Watch percentage to control duration field
  const percentage = form.watch("percentage") || 0;
  const isDurationEnabled = percentage > 0;

  const { create, creating } = useCreateToken(fcWalletAddress);

  const disabled =
    !authenticated || !fcWalletAddress || hasTokens || creating || isSubmitting;

  const onSubmit = async (data: CreateTokenData) => {
    try {
      setIsSubmitting(true);

      // 3. 上传到Arweave
      const formData = new FormData();
      formData.append("file", data.image);
      const uploadRes = await sdk.request<{
        everHash?: string;
        itemId: string;
        arUrl: string;
        arseedUrl: string;
      }>(`/ar-upload/image`, {
        method: "POST",
        body: formData,
        isFormData: true,
      });
      const { data: uploadData } = uploadRes;
      if (!uploadData?.arseedUrl) {
        throw new Error("Failed to upload image");
      }

      const token = await create({ ...data, image: uploadData.arseedUrl });
      setTokens((prev) => {
        if (!prev) {
          return [token];
        }
        return [...prev, token];
      });
      if (token.token_address) {
        toast.success(
          <div className="flex items-center gap-2 p-2">
            Token created successfully!{" "}
            <Link
              href={getClankerTokenPath(token.token_address)}
              target="_blank"
              className="text-primary hover:underline"
            >
              View Token
            </Link>
          </div>,
          {
            position: "top-center",
          }
        );
        setOpen(false);
        form.reset();
      } else {
        toast.error("Token creation failed, please try again");
        return;
      }
    } catch (error) {
      toast.error("Creation failed, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePercentageQuickSet = (value: number) => {
    form.setValue("percentage", value);
    // If setting percentage > 0 and duration is 0, set minimum duration
    if (value > 0 && form.getValues("durationInDays") === 0) {
      form.setValue("durationInDays", 31);
    }
    // If setting percentage to 0, reset duration
    if (value === 0) {
      form.setValue("durationInDays", 0);
    }
  };

  const handleDurationQuickSet = (value: number) => {
    if (isDurationEnabled) {
      form.setValue("durationInDays", value);
    }
  };

  const handleVaultSettingsToggle = () => {
    setIsVaultSettingsExpanded(!isVaultSettingsExpanded);

    // If collapsing and fields are empty, clear them
    if (isVaultSettingsExpanded && !percentage) {
      form.setValue("percentage", undefined);
      form.setValue("durationInDays", undefined);
    }
  };
  return (
    <>
      {" "}
      <DialogHeader>
        <DialogTitle>Create New Token</DialogTitle>
      </DialogHeader>
      <div className="space-y-6 px-1 max-h-[85vh]  overflow-y-auto">
        <CreateTokenAlert />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. My Token"
                      disabled={disabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Symbol</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. MTK"
                      disabled={disabled}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Token Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={value}
                      onChange={onChange}
                      disabled={disabled}
                      maxSize={1}
                      accept="image/*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Creator Vault Settings - Collapsible Optional Section */}
            <div className="space-y-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleVaultSettingsToggle}
                disabled={disabled}
                className="w-full justify-between p-3 h-auto border border-border hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Creator Vault Settings</span>
                  <span className="text-xs text-muted-foreground">
                    (Optional)
                  </span>
                </div>
                {isVaultSettingsExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {isVaultSettingsExpanded && (
                <div className="space-y-6 border border-dashed border-primary/25 rounded-lg p-4 bg-primary/5">
                  <div className="text-sm text-muted-foreground">
                    Configure token vesting and lockup settings for the creator
                  </div>

                  <FormField
                    control={form.control}
                    name="percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vault percentage (%)</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              placeholder="0"
                              disabled={disabled}
                              value={field.value || ""}
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? undefined
                                    : Number.parseInt(e.target.value) || 0;
                                field.onChange(value);
                                // Auto-set duration when percentage is set
                                if (
                                  value &&
                                  value > 0 &&
                                  !form.getValues("durationInDays")
                                ) {
                                  form.setValue("durationInDays", 31);
                                }
                                if (!value || value === 0) {
                                  form.setValue("durationInDays", undefined);
                                }
                              }}
                            />
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={disabled}
                                onClick={() => handlePercentageQuickSet(5)}
                                className={cn(
                                  percentage === 5 &&
                                    "bg-primary text-primary-foreground"
                                )}
                              >
                                5%
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={disabled}
                                onClick={() => handlePercentageQuickSet(15)}
                                className={cn(
                                  percentage === 15 &&
                                    "bg-primary text-primary-foreground"
                                )}
                              >
                                15%
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={disabled}
                                onClick={() => handlePercentageQuickSet(30)}
                                className={cn(
                                  percentage === 30 &&
                                    "bg-primary text-primary-foreground"
                                )}
                              >
                                30%
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={disabled}
                                onClick={() => handlePercentageQuickSet(0)}
                                className={cn(
                                  !percentage &&
                                    "bg-primary text-primary-foreground"
                                )}
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="durationInDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className={cn(
                            !isDurationEnabled && "text-muted-foreground"
                          )}
                        >
                          Unlocks in a few days
                          {!isDurationEnabled && " (Set percentage first)"}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Input
                              type="number"
                              min={isDurationEnabled ? 31 : 0}
                              max={365}
                              placeholder={isDurationEnabled ? "31" : "0"}
                              disabled={disabled || !isDurationEnabled}
                              value={field.value || ""}
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? undefined
                                    : Number.parseInt(e.target.value) || 0;
                                field.onChange(value);
                              }}
                            />
                            {isDurationEnabled && (
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={disabled || !isDurationEnabled}
                                  onClick={() => handleDurationQuickSet(31)}
                                  className={cn(
                                    field.value === 31 &&
                                      "bg-primary text-primary-foreground"
                                  )}
                                >
                                  31 days
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={disabled || !isDurationEnabled}
                                  onClick={() => handleDurationQuickSet(90)}
                                  className={cn(
                                    field.value === 90 &&
                                      "bg-primary text-primary-foreground"
                                  )}
                                >
                                  90 days
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={disabled || !isDurationEnabled}
                                  onClick={() => handleDurationQuickSet(180)}
                                  className={cn(
                                    field.value === 180 &&
                                      "bg-primary text-primary-foreground"
                                  )}
                                >
                                  180 days
                                </Button>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-background">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={disabled}>
                {isSubmitting ? "Creating..." : "Create Token"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

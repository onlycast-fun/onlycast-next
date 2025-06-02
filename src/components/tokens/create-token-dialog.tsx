"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import { useUser } from "@/providers/user-provider";
import { useUserWallet } from "@/hooks/wallet/useUserWallet";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateTokenData>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      name: "",
      symbol: "",
      image: "",
      percentage: 0,
      durationInDays: 0,
    },
  });

  const { authenticated, login } = usePrivy();
  const { linkedExternalWallet, linkWallet } = useUserWallet();
  const { user, setUser } = useUser();
  const hasTokens = (user?.tokens?.length ?? 0) > 0;

  const { create, creating } = useCreateToken();

  const onSubmit = async (data: CreateTokenData) => {
    if (!authenticated) {
      login();
      return;
    }
    if (!linkedExternalWallet) {
      linkWallet();
      return;
    }
    if (hasTokens) {
      return;
    }
    try {
      setIsSubmitting(true);
      const token = await create(data);
      setUser((prev) => {
        if (!prev) {
          return {
            tokens: [token],
          };
        }
        return {
          ...prev,
          tokens: [token],
        };
      });
      if (token.token_address) {
        toast.success(
          <div>
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

  const disabled =
    !authenticated ||
    !linkedExternalWallet?.address ||
    hasTokens ||
    creating ||
    isSubmitting;

  return (
    <>
      {" "}
      <DialogHeader>
        <DialogTitle>Create New Token</DialogTitle>
      </DialogHeader>
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.png"
                    type="url"
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
            name="percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Percentage: {field.value}%</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[field.value || 0]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-full"
                    disabled={disabled}
                  />
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
                <FormLabel>Duration in Days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    disabled={disabled}
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value) || 0)
                    }
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
            <Button type="submit" disabled={disabled}>
              {isSubmitting ? "Creating..." : "Create Token"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

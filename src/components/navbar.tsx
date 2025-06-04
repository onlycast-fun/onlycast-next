"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Coins, Trophy } from "lucide-react";
import { SocialLinks } from "@/components/social-links";
import { UserProfile } from "./user/user-profile";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Posts", icon: Home },
    { href: "/tokens", label: "Tokens", icon: Coins },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-full">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-primary">
              Onlycast
            </Link>

            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - Social Links and User Profile */}
          <div className="flex items-center space-x-4">
            <SocialLinks />
            <div className="h-6 w-px bg-border" /> {/* Separator */}
            <UserProfile />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
        <div className="flex justify-around items-center py-2 px-4 max-w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-[60px]",
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Top Bar - Logo, Social Links, and User Profile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-full">
          <Link href="/" className="text-xl font-bold text-primary">
            Onlycast
          </Link>

          <div className="flex items-center space-x-2">
            <SocialLinks />
            <div className="h-4 w-px bg-border" /> {/* Separator */}
            <UserProfile />
          </div>
        </div>
      </div>
    </>
  );
}

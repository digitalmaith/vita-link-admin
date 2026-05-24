"use client";

import { useState, useEffect } from "react";
import { Loader2, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeIconProps {
  iconUrl: string;
  name: string;
  emoji?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizesMap = {
  sm: { container: "w-8 h-8", icon: "w-4 h-4", emoji: "text-lg" },
  md: { container: "w-12 h-12", icon: "w-5 h-5", emoji: "text-xl" },
  lg: { container: "w-16 h-16", icon: "w-7 h-7", emoji: "text-2xl" },
  xl: { container: "w-20 h-20", icon: "w-9 h-9", emoji: "text-3xl" },
};

export function BadgeIcon({ iconUrl, name, emoji, size = "md", className }: BadgeIconProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const sizes = sizesMap[size];
  const isValidUrl = iconUrl && iconUrl.startsWith('http');

  useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [iconUrl]);

  return (
    <div className={cn(
      "relative rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden shrink-0",
      "ring-1 ring-primary/10",
      sizes.container,
      className
    )}>
      {isValidUrl && !imgError && (
        <>
          <img
            src={iconUrl}
            alt={name}
            className={cn(
              "w-full h-full object-contain p-1.5 transition-opacity duration-300",
              imgLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className={cn(sizes.icon, "text-primary animate-spin")} />
            </div>
          )}
        </>
      )}

      {(imgError || !isValidUrl) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {emoji ? (
            <span className={sizes.emoji}>{emoji}</span>
          ) : (
            <Award className={cn(sizes.icon, "text-primary")} />
          )}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}
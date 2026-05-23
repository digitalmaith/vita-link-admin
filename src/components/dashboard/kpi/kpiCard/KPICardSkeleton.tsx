"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function KPICardSkeleton() {
  return (
    <Card className="relative overflow-hidden border-neutral-200/80 dark:border-neutral-800/80">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-start justify-between">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <Skeleton className="h-7 w-20 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-2 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
import { cn } from "@/client/shadcn/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("animate-pulse rounded-md bg-muted dark:bg-gray-800", className)} {...props} />;
}

export { Skeleton };

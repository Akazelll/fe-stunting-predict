import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "warning" | "success" | "neutral";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-blue-300 text-black",
    warning: "bg-yellow-300 text-black",
    success: "bg-green-400 text-black",
    neutral: "bg-gray-200 text-black",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-none border-2 border-black px-2.5 py-0.5 text-xs font-bold uppercase transition-colors shadow-[2px_2px_0_0_#000]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };

// components/ui/input.tsx
import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[border-color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "ring-ring/5 focus-visible:ring-2 focus-visible:ring-primary/15 focus-visible:border-primary focus-visible:outline-none",
        "outline-ring/40 dark:outline-ring/30 dark:ring-ring/10",
        "aria-invalid:border-destructive aria-invalid:outline-destructive/40 aria-invalid:ring-destructive/20 aria-invalid:focus-visible:ring-destructive/30 aria-invalid:focus-visible:border-destructive",
        "dark:aria-invalid:border-destructive dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/40 dark:aria-invalid:focus-visible:ring-destructive/40",
        className
      )}
      {...props}
    />
  );
}

export { Input };

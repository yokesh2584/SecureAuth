import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

export interface PurpleInputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export const PurpleInput = forwardRef<HTMLInputElement, PurpleInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(
          "h-12 rounded-md border border-gray-300 bg-white px-4 py-5 text-sm text-gray-800 shadow-sm transition-all duration-150",
          "focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none",
          className,
        )}
        {...props}
      />
    );
  },
);

PurpleInput.displayName = "PurpleInput";

import * as React from "react";

import { cn } from "@/libs/utils/utils";

interface InputProps extends React.ComponentProps<"input"> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftIconClassName?: string;
  rightIconClassName?: string;
}

function Input({
  className,
  type,
  error,
  leftIcon,
  rightIcon,
  leftIconClassName,
  rightIconClassName,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      <div className="relative">
        {leftIcon && (
          <div
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
              leftIconClassName
            )}
          >
            {leftIcon}
          </div>
        )}

        <input
          type={type}
          data-slot="input"
          aria-invalid={!!error}
          className={cn(
            "h-10 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-black disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",

            // file input styles
            "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",

            // error styles
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",

            // icon paddings
            leftIcon && "pl-10",
            rightIcon && "pr-10",

            className
          )}
          {...props}
        />

        {rightIcon && (
          <div
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground",
              rightIconClassName
            )}
          >
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export { Input };
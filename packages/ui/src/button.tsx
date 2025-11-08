import { ComponentPropsWithRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md border border-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";
const variants = {
  primary: "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-500",
  secondary:
    "bg-white text-slate-900 border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-300",
  ghost: "bg-transparent text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-300"
} as const;

export type ButtonVariant = keyof typeof variants;

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      className={twMerge(base, variants[variant], className)}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = "Button";


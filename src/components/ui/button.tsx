import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        {
          "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700": variant === "primary",
          "bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200": variant === "secondary",
          "bg-transparent text-gray-600 hover:bg-gray-100": variant === "ghost",
          "bg-red-500 text-white hover:bg-red-600": variant === "danger",
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2.5 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

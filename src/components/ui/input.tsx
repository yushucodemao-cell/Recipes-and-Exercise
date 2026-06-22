import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-base outline-none transition-colors",
        "focus:border-brand-400 focus:ring-2 focus:ring-brand-100",
        "placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-base outline-none transition-colors resize-none",
        "focus:border-brand-400 focus:ring-2 focus:ring-brand-100",
        "placeholder:text-gray-400",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-sm font-medium text-gray-700 mb-1", className)} {...props}>
      {children}
    </label>
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-base outline-none",
        "focus:border-brand-400 focus:ring-2 focus:ring-brand-100",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

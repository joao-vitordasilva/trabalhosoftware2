import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

function getVariantClassName(variant: Variant) {
  if (variant === "secondary") return "btn-secondary";
  if (variant === "danger") return "btn-danger";
  return "btn-primary";
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return <button className={`${getVariantClassName(variant)} ${className}`.trim()} {...props} />;
}

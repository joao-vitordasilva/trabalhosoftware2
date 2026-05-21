import type { ButtonHTMLAttributes } from "react";

type VariantB = "primary" | "secondary" | "danger";

const classesB: Record<VariantB, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
};

type PropsB = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: VariantB;
};

function mergeB(variant: VariantB, customClass: string) {
  const partsB = [classesB[variant]];
  if (customClass) partsB.push(customClass);
  return partsB.join(" ").trim();
}

export function Button({ className = "", variant = "primary", ...props }: PropsB) {
  return <button data-ui="button-2" className={mergeB(variant, className)} {...props} />;
}

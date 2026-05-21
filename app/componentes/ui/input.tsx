import type { InputHTMLAttributes } from "react";

type PropsB = InputHTMLAttributes<HTMLInputElement>;

function laneB(incoming: string) {
  return ["field", incoming].filter(Boolean).join(" ").trim();
}

export function Input({ className = "", ...props }: PropsB) {
  return <input data-ui="input-2" className={laneB(className)} {...props} />;
}

import type { TextareaHTMLAttributes } from "react";

type PropsB = TextareaHTMLAttributes<HTMLTextAreaElement>;

const baseB = "text-field";

export function Textarea({ className = "", ...props }: PropsB) {
  const classesB = [baseB, className].filter(Boolean).join(" ").trim();
  return <textarea data-ui="textarea-2" className={classesB} {...props} />;
}

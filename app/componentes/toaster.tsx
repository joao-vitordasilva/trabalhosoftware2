"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      richColors
      position="top-right"
      toastOptions={{
        style: {
          background: "rgba(255,255,255,0.92)",
          color: "#33114b",
          border: "1px solid rgba(236, 72, 153, 0.18)",
        },
      }}
    />
  );
}

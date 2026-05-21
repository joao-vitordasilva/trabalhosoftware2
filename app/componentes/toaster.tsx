"use client";

import { Toaster } from "sonner";

const toastOptionsB = {
  style: {
    background: "#fff7ed",
    color: "#7c2d12",
    border: "1px solid #fdba74",
  },
};

export default function AppToaster() {
  return <Toaster richColors position="top-center" expand={true} toastOptions={toastOptionsB} />;
}

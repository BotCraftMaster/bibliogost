"use client";

// Re-export toast from sonner
import { toast } from "sonner";

// Simple wrapper around sonner toast
function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
  };
}

export { useToast, toast };

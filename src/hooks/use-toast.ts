
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number; // Add duration property
};

export function toast({ title, description, variant = "default", duration = 3000 }: ToastProps) {
  const toastFn = variant === "destructive" ? sonnerToast.error : 
               variant === "success" ? sonnerToast.success : 
               sonnerToast;

  toastFn(title, {
    description,
    duration,
  });
}

// Create a mock implementation of the shadcn/ui toast hook
// This allows components expecting the Radix Toast API to work
export function useToast() {
  return { 
    toast,
    // Add an empty toasts array to prevent the "toasts.map is not a function" error
    toasts: []
  };
}

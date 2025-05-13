
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number; 
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
export function useToast() {
  return { 
    toast,
    toasts: []
  };
}

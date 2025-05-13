
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

export function toast({ title, description, variant = "default" }: ToastProps) {
  const toastFn = variant === "destructive" ? sonnerToast.error : 
                 variant === "success" ? sonnerToast.success : 
                 sonnerToast;

  toastFn(title, {
    description,
  });
}

export function useToast() {
  return { toast };
}

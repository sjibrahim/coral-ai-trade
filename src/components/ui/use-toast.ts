
import { toast, useToast } from "@/hooks/use-toast"

// Configure the toast defaults
// @ts-ignore - Ignore type checking for this configuration
toast.config({
  duration: 1000, // Default 1000ms timeout
  limit: 1, // Show only one toast at a time
})

export { useToast, toast }

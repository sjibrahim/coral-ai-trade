
import React from "react";
import { cn } from "@/lib/utils";

interface ConfirmButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  text: string;
  loadingText?: string;
  className?: string;
}

const ConfirmButton = ({ 
  onClick, 
  disabled, 
  isLoading, 
  text,
  loadingText = "Processing...",
  className 
}: ConfirmButtonProps) => {
  return (
    <button 
      onClick={!disabled && !isLoading ? onClick : undefined}
      disabled={disabled || isLoading}
      className={cn(
        "w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center",
        !disabled && !isLoading
          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg active:scale-[0.98]" 
          : "bg-gray-700/50 text-gray-400 cursor-not-allowed",
        className
      )}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </>
      ) : text}
    </button>
  );
};

export default ConfirmButton;

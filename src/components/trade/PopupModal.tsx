
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const PopupModal: React.FC<PopupModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  actionLabel,
  onAction
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-400 mx-auto" />;
      case 'warning':
        return <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto" />;
      default:
        return <AlertTriangle className="w-12 h-12 text-blue-400 mx-auto" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'from-green-600/20 to-emerald-600/20';
      case 'error':
        return 'from-red-600/20 to-rose-600/20';
      case 'warning':
        return 'from-yellow-600/20 to-orange-600/20';
      default:
        return 'from-blue-600/20 to-indigo-600/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto w-[90%] bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 p-0 overflow-hidden rounded-2xl">
        <div className={`relative p-6 bg-gradient-to-br ${getBackgroundColor()} backdrop-blur-sm`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-white/10 text-white"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="text-center space-y-4">
            <div className="mb-4">
              {getIcon()}
            </div>
            
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white text-center">
                {title}
              </DialogTitle>
            </DialogHeader>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              {message}
            </p>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Close
              </Button>
              {actionLabel && onAction && (
                <Button
                  onClick={onAction}
                  className={`flex-1 font-semibold ${
                    type === 'success' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : type === 'error'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {actionLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupModal;

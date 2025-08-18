
import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileNavbarProps {
  showBackButton?: boolean;
  title?: string;
  headerAction?: ReactNode;
}

const MobileNavbar = ({ showBackButton = false, title = "Trexo", headerAction }: MobileNavbarProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-accent rounded-lg transition-colors -ml-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>
        {headerAction && (
          <div className="flex-shrink-0">
            {headerAction}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNavbar;

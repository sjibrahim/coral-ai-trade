
import { ReactNode } from 'react';
import MobileNavbar from './MobileNavbar';

interface MobileLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  title?: string;
  noScroll?: boolean;
  hideFooter?: boolean;
  hideNavbar?: boolean;
  headerAction?: ReactNode;
}

const MobileLayout = ({ 
  children, 
  showBackButton = false, 
  title = "Trexo", 
  noScroll = false,
  hideFooter = false,
  hideNavbar = false,
  headerAction
}: MobileLayoutProps) => {
  return (
    <div className="flex flex-col h-screen bg-background">
      {!hideNavbar && (
        <MobileNavbar 
          showBackButton={showBackButton} 
          title={title} 
          headerAction={headerAction}
        />
      )}
      <main 
        className={`flex-1 ${noScroll ? 'overflow-hidden' : 'overflow-y-auto'} ${
          hideFooter ? '' : 'pb-20'
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default MobileLayout;

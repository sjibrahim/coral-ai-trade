
import { ReactNode } from 'react';
import MobileNavbar from './MobileNavbar';

interface MobileLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  title?: string;
  noScroll?: boolean;
  hideFooter?: boolean;
  hideNavbar?: boolean;
}

const MobileLayout = ({ 
  children, 
  showBackButton = false, 
  title = "CORAL", 
  noScroll = false,
  hideFooter = false,
  hideNavbar = false
}: MobileLayoutProps) => {
  return (
    <div className="flex flex-col h-screen bg-background">
      {!hideNavbar && <MobileNavbar showBackButton={showBackButton} title={title} />}
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

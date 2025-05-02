
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ScrollArea className="flex-1">
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </ScrollArea>
      <Footer />
    </div>
  );
};

export default MainLayout;

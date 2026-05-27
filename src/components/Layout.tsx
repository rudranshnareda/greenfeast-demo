import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  noPadding?: boolean;
}

export default function Layout({ children, title, showBack, onBack, noPadding }: LayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDF9E8] flex flex-col">
      {(showBack || title) && (
        <header className="flex items-center gap-3 px-4 py-3 bg-[#FDF9E8] sticky top-0 z-10 border-b border-[#E5E7EB]">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center active:bg-[#E8F5E9] transition-colors"
            >
              <ArrowLeft size={22} className="text-[#1A1A1A]" />
            </button>
          )}
          {title && (
            <h1 className="text-lg font-semibold text-[#1A1A1A] flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {title}
            </h1>
          )}
        </header>
      )}
      <main className={`flex-1 ${noPadding ? '' : 'px-4 py-4'}`}>
        {children}
      </main>
    </div>
  );
}

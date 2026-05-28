import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  noPadding?: boolean;
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

export default function Layout({ children, title, subtitle, showBack, onBack, noPadding }: LayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <motion.div
      className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-cream via-cream to-bone/40 flex flex-col"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {(showBack || title) && (
        <header className="flex items-start gap-3 px-6 pt-8 pb-4 sticky top-0 z-10 bg-cream/80 backdrop-blur-sm">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 mt-0.5 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center active:bg-bone/60 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={20} strokeWidth={1.5} className="text-pine" />
            </button>
          )}
          <div>
            {title && (
              <h1 className="font-serif text-3xl text-ink leading-tight">{title}</h1>
            )}
            {subtitle && (
              <p className="font-sans text-xs text-slate uppercase tracking-widest mt-1">{subtitle}</p>
            )}
          </div>
        </header>
      )}
      <main className={`flex-1 ${noPadding ? '' : 'px-6 py-4'}`}>
        {children}
      </main>
    </motion.div>
  );
}

import { useLocation, useNavigate } from 'react-router-dom';
import { Home, UtensilsCrossed, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { path: '/', label: 'Today', Icon: Home },
  { path: '/menu', label: 'Menu', Icon: UtensilsCrossed },
  { path: '/subscription', label: 'Plan', Icon: Calendar },
  { path: '/account', label: 'You', Icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-bone h-16 flex items-center z-50 max-w-md mx-auto">
      {tabs.map(({ path, label, Icon }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] relative pb-1"
          >
            <Icon
              size={20}
              strokeWidth={1.5}
              className={active ? 'text-pine' : 'text-slate'}
            />
            <span
              className={`font-sans text-[9px] uppercase tracking-widest ${active ? 'text-pine' : 'text-slate'}`}
            >
              {label}
            </span>
            <AnimatePresence>
              {active && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-goldenrod"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </nav>
  );
}

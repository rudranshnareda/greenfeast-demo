import { useLocation, useNavigate } from 'react-router-dom';
import { Home, UtensilsCrossed, Calendar, User } from 'lucide-react';

const tabs = [
  { path: '/', label: 'Home', Icon: Home },
  { path: '/menu', label: 'Menu', Icon: UtensilsCrossed },
  { path: '/subscription', label: 'Subscription', Icon: Calendar },
  { path: '/account', label: 'Account', Icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] h-16 flex items-center z-50 max-w-md mx-auto">
      {tabs.map(({ path, label, Icon }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors duration-150"
          >
            <Icon
              size={22}
              className={active ? 'text-[#1B5E20]' : 'text-[#9CA3AF]'}
              strokeWidth={active ? 2.5 : 1.8}
            />
            <span
              className={`text-[10px] font-medium ${active ? 'text-[#1B5E20]' : 'text-[#9CA3AF]'}`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

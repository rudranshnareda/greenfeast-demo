import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, UtensilsCrossed, User, Sparkles } from 'lucide-react';
import { getUserFromStorage } from '../lib/storage';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const isSubscriber = !!(user?.plan);

  const tabs = [
    { path: '/', label: 'Home', Icon: Home },
    { path: '/subscription', label: isSubscriber ? 'My Plan' : 'Subscribe', Icon: isSubscriber ? BookOpen : Sparkles },
    { path: '/menu', label: 'Menu', Icon: UtensilsCrossed },
    { path: '/account', label: 'Account', Icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] h-16 flex items-center z-50 max-w-md mx-auto">
      {tabs.map(({ path, label, Icon }) => {
        const active = location.pathname === path;
        const isSubscribeTab = label === 'Subscribe';
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors duration-150"
          >
            <Icon
              size={22}
              className={
                isSubscribeTab
                  ? 'text-[#FCD303]'
                  : active ? 'text-[#1B5E20]' : 'text-[#9CA3AF]'
              }
              strokeWidth={active ? 2.5 : 1.8}
            />
            <span
              className={`text-[10px] font-medium ${
                isSubscribeTab
                  ? 'text-[#B45309] font-semibold'
                  : active ? 'text-[#1B5E20]' : 'text-[#9CA3AF]'
              }`}
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

import { useState } from 'react';
import { Edit2, MessageCircle, HelpCircle, LogOut, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import { getUserFromStorage, clearStorage } from '../../lib/storage';

const FAQS = [
  { q: 'Can I change my meals after subscribing?', a: 'Yes! You can swap meals up to 8 PM the night before delivery.' },
  { q: 'What if I need to skip a day?', a: 'Use "Skip a day" in My Subscription anytime before 8 PM the night before.' },
  { q: 'Are your meals really preservative-free?', a: 'Absolutely. Every meal is freshly prepared the same morning it\'s delivered.' },
  { q: 'Can I pause my subscription?', a: 'Yes, you can pause for up to 2 weeks per cycle from the Subscription tab.' },
  { q: 'Can I change my delivery time slot?', a: 'Yes! Just message us on WhatsApp and we\'ll update your slot right away.' },
];

export default function Account() {
  const user = getUserFromStorage()!;
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleLogout = () => {
    clearStorage();
    window.location.reload();
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDF9E8]">
      <header className="px-4 pt-10 pb-4">
        <h1 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Account
        </h1>
      </header>

      <div className="px-4 pb-24 space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>Profile</p>
            <button className="text-[#1B5E20] text-sm font-medium flex items-center gap-1">
              <Edit2 size={14} /> Edit
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#1B5E20] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold text-[#1A1A1A]">{user.name}</p>
              <p className="text-sm text-[#6B7280]">+91 {user.phone}</p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <a
            href="https://wa.me/918829040566"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-4 min-h-[56px] border-b border-[#F3F4F6] active:bg-[#F9FAFB]"
          >
            <MessageCircle size={18} className="text-[#25D366]" />
            <span className="text-sm text-[#1A1A1A] flex-1">WhatsApp Support</span>
          </a>

          <button
            onClick={() => setFaqOpen(faqOpen === -1 ? null : -1)}
            className="flex items-center gap-3 px-4 py-4 w-full min-h-[56px] border-b border-[#F3F4F6]"
          >
            <HelpCircle size={18} className="text-[#1B5E20]" />
            <span className="text-sm text-[#1A1A1A] flex-1 text-left">FAQ</span>
            {faqOpen === -1 ? <ChevronUp size={16} className="text-[#9CA3AF]" /> : <ChevronDown size={16} className="text-[#9CA3AF]" />}
          </button>

          {faqOpen === -1 && (
            <div className="px-4 pb-2 space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                    className="flex items-start justify-between gap-2 w-full py-2 text-left"
                  >
                    <p className="text-sm font-medium text-[#1A1A1A]">{faq.q}</p>
                    {faqOpen === i ? <ChevronUp size={14} className="text-[#9CA3AF] flex-shrink-0 mt-0.5" /> : <ChevronDown size={14} className="text-[#9CA3AF] flex-shrink-0 mt-0.5" />}
                  </button>
                  {faqOpen === i && (
                    <p className="text-xs text-[#6B7280] pb-2 leading-relaxed">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-4 w-full min-h-[56px] active:bg-[#F9FAFB]"
          >
            <LogOut size={18} className="text-[#6B7280]" />
            <span className="text-sm text-[#6B7280]">Logout</span>
          </button>
        </div>

        {/* Reset Demo button */}
        <button
          onClick={() => setResetConfirm(true)}
          className="w-full py-3 rounded-full border-2 border-red-400 text-red-500 font-semibold text-sm min-h-[48px] flex items-center justify-center gap-2 active:bg-red-50 transition-colors"
        >
          <Trash2 size={16} />
          Reset Demo (Clear All Data)
        </button>
      </div>

      <BottomNav />

      {/* Logout confirm */}
      {logoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Log out?</h2>
            <p className="text-sm text-[#6B7280] mb-5">Your subscription data will be saved.</p>
            <div className="flex gap-3">
              <button onClick={() => setLogoutConfirm(false)} className="flex-1 py-3 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-semibold text-sm min-h-[44px]">Cancel</button>
              <button onClick={handleLogout} className="flex-1 py-3 rounded-full bg-[#1B5E20] text-white font-semibold text-sm min-h-[44px]">Log out</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset confirm */}
      {resetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Reset demo?</h2>
            <p className="text-sm text-[#6B7280] mb-5">This clears all saved data and returns to the first-time user flow.</p>
            <div className="flex gap-3">
              <button onClick={() => setResetConfirm(false)} className="flex-1 py-3 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-semibold text-sm min-h-[44px]">Cancel</button>
              <button onClick={handleReset} className="flex-1 py-3 rounded-full bg-red-500 text-white font-semibold text-sm min-h-[44px]">Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

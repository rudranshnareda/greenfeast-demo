import { useState } from 'react';
import { Edit2, Wallet, MessageCircle, HelpCircle, LogOut, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../../components/BottomNav';
import { getUserFromStorage, clearStorage } from '../../lib/storage';

const FAQS = [
  { q: 'Can I change my meals after subscribing?', a: 'Yes — curate your week up to 8 PM the night before delivery.' },
  { q: 'What if I need to skip a day?', a: 'Use "Skip a day" in Your Plan anytime before 8 PM the night before.' },
  { q: 'Are your meals preservative-free?', a: 'Always. Every meal is prepared fresh on the morning of delivery.' },
  { q: 'Can I pause my subscription?', a: 'Yes, pause for up to two weeks per cycle from the Plan tab.' },
];

export default function Account() {
  const user = getUserFromStorage()!;
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [showFaqs, setShowFaqs] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const paymentDate = new Date(user.subscriptionStartDate ?? Date.now())
    .toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleLogout = () => { clearStorage(); window.location.reload(); };
  const handleReset = () => { localStorage.clear(); window.location.reload(); };

  const SECTION_LABEL = 'font-sans text-[10px] uppercase tracking-widest text-slate mb-4 block';

  return (
    <motion.div
      className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-cream via-cream to-bone/40"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <header className="px-6 pt-10 pb-5">
        <h1 className="font-serif text-3xl text-ink">You</h1>
      </header>

      <div className="px-6 pb-24 space-y-4">
        {/* Profile */}
        <div className="glass grain rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className={SECTION_LABEL}>Profile</span>
            <button className="font-sans text-xs text-pine flex items-center gap-1">
              <Edit2 size={12} strokeWidth={1.5} /> Edit
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-pine flex items-center justify-center flex-shrink-0">
              <span className="font-serif text-2xl text-cream">{user.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-serif text-xl text-ink">{user.name}</p>
              <p className="font-sans text-sm text-slate">+91 {user.phone}</p>
            </div>
          </div>
        </div>

        {/* Credit */}
        <div className="glass grain rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={14} strokeWidth={1.5} className="text-slate" />
            <span className={SECTION_LABEL + ' mb-0'}>Credit</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-serif text-3xl text-ink">₹{user.wallet ?? 0}</p>
              <p className="font-sans text-[10px] text-slate uppercase tracking-widest mt-0.5">Available</p>
            </div>
            <button className="border border-pine/30 text-pine font-sans text-xs tracking-wide px-4 py-2 rounded-xl min-h-[40px]">
              Add credit
            </button>
          </div>
          <button className="font-sans text-xs text-pine mt-3 block">View transactions</button>
          <div className="mt-2 border border-bone rounded-xl px-4 py-3">
            <p className="font-sans text-[10px] text-slate/60 italic text-center">No transactions yet</p>
          </div>
        </div>

        {/* Payment history */}
        <div className="glass grain rounded-2xl p-6">
          <span className={SECTION_LABEL}>Payment history</span>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-sm text-charcoal">{user.plan?.name}</p>
              <p className="font-sans text-[10px] text-slate uppercase tracking-widest mt-0.5">{paymentDate} · UPI</p>
            </div>
            <div className="text-right">
              <p className="font-serif text-lg text-pine">₹{user.plan?.basePrice.toLocaleString()}</p>
              <button className="font-sans text-[10px] text-pine/60 underline mt-0.5">Invoice</button>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="glass grain rounded-2xl overflow-hidden divide-y divide-bone/50">
          <a
            href="https://wa.me/918829040566"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-6 py-4 min-h-[56px] active:bg-bone/20 transition-colors"
          >
            <MessageCircle size={16} strokeWidth={1.5} className="text-[#25D366]" />
            <span className="font-sans text-sm text-charcoal flex-1">WhatsApp</span>
          </a>

          <button
            onClick={() => setShowFaqs(!showFaqs)}
            className="flex items-center gap-4 px-6 py-4 w-full min-h-[56px] active:bg-bone/20"
          >
            <HelpCircle size={16} strokeWidth={1.5} className="text-slate" />
            <span className="font-sans text-sm text-charcoal flex-1 text-left">FAQ</span>
            {showFaqs ? <ChevronUp size={14} className="text-slate" /> : <ChevronDown size={14} className="text-slate" />}
          </button>

          <AnimatePresence>
            {showFaqs && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4 space-y-1">
                  {FAQS.map((faq, i) => (
                    <div key={i}>
                      <button
                        onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                        className="flex items-start justify-between gap-2 w-full py-3 text-left"
                      >
                        <p className="font-sans text-sm text-charcoal">{faq.q}</p>
                        {faqOpen === i
                          ? <ChevronUp size={13} className="text-slate flex-shrink-0 mt-0.5" />
                          : <ChevronDown size={13} className="text-slate flex-shrink-0 mt-0.5" />}
                      </button>
                      <AnimatePresence>
                        {faqOpen === i && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="font-sans text-xs text-slate leading-relaxed italic overflow-hidden"
                          >
                            {faq.a}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setLogoutConfirm(true)}
            className="flex items-center gap-4 px-6 py-4 w-full min-h-[56px] active:bg-bone/20"
          >
            <LogOut size={16} strokeWidth={1.5} className="text-slate" />
            <span className="font-sans text-sm text-slate">Log out</span>
          </button>
        </div>

        {/* Reset demo */}
        <button
          onClick={() => setResetConfirm(true)}
          className="w-full py-3 rounded-xl border border-red-300/50 text-red-400/80 font-sans text-xs tracking-wide min-h-[44px] flex items-center justify-center gap-2 active:bg-red-50/30 transition-colors"
        >
          <Trash2 size={13} strokeWidth={1.5} />
          Reset demo
        </button>
      </div>

      <BottomNav />

      {/* Logout confirm */}
      <AnimatePresence>
        {logoutConfirm && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setLogoutConfirm(false)} />
            <motion.div className="relative glass-dark grain rounded-3xl p-8 w-full max-w-xs" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <h2 className="font-serif text-2xl text-cream mb-2">Log out?</h2>
              <p className="font-sans text-sm text-cream/60 mb-6">Your subscription data will be saved.</p>
              <div className="flex gap-3">
                <button onClick={() => setLogoutConfirm(false)} className="flex-1 py-3 rounded-xl border border-cream/20 text-cream font-sans text-sm min-h-[48px]">Cancel</button>
                <button onClick={handleLogout} className="flex-1 py-3 rounded-xl bg-pine text-cream font-sans text-sm min-h-[48px]">Log out</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset confirm */}
      <AnimatePresence>
        {resetConfirm && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setResetConfirm(false)} />
            <motion.div className="relative glass-dark grain rounded-3xl p-8 w-full max-w-xs" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <h2 className="font-serif text-2xl text-cream mb-2">Reset demo?</h2>
              <p className="font-sans text-sm text-cream/60 mb-6">All saved data will be cleared and you'll return to the first-time flow.</p>
              <div className="flex gap-3">
                <button onClick={() => setResetConfirm(false)} className="flex-1 py-3 rounded-xl border border-cream/20 text-cream font-sans text-sm min-h-[48px]">Cancel</button>
                <button onClick={handleReset} className="flex-1 py-3 rounded-xl bg-red-500/80 text-cream font-sans text-sm min-h-[48px]">Reset</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

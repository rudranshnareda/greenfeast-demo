import { useState } from 'react';
import { Pause, SkipForward, ArrowUpDown, X, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../../components/BottomNav';
import { getUserFromStorage } from '../../lib/storage';
import { ADD_ONS } from '../../data/menu';

export default function Subscription() {
  const user = getUserFromStorage()!;
  const plan = user.plan!;

  const nextRenewal = (() => {
    const d = new Date(user.subscriptionStartDate ?? Date.now());
    d.setDate(d.getDate() + 30);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  })();

  const activeAddOns = (user.addOns ?? []).filter(a => a.selected).map(a => ADD_ONS.find(d => d.id === a.id));
  const [cancelModal, setCancelModal] = useState(false);

  return (
    <motion.div
      className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-cream via-cream to-bone/40"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <header className="px-6 pt-10 pb-5">
        <h1 className="font-serif text-3xl text-ink">Your plan</h1>
      </header>

      <div className="px-6 pb-24 space-y-4">
        {/* Plan card */}
        <div className="glass grain rounded-2xl overflow-hidden">
          <div className="bg-pine px-6 py-5">
            <div className="flex items-center justify-between">
              <p className="font-serif text-2xl text-cream">{plan.name}</p>
              <span className="font-sans text-[9px] uppercase tracking-widest bg-cream/10 text-cream px-3 py-1 rounded-full border border-cream/20">
                Active
              </span>
            </div>
            <p className="font-sans text-xs text-cream/60 uppercase tracking-widest mt-1.5">
              {plan.mealsTotal} meals · {plan.daysPerWeek} days/week · ₹{plan.basePrice.toLocaleString()}
            </p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs text-slate uppercase tracking-widest">Next renewal</span>
              <span className="font-serif text-sm text-ink">{nextRenewal}</span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-xs text-slate uppercase tracking-widest">Remaining</span>
                <span className="font-serif text-base text-pine">{user.deliveriesRemaining} of {plan.mealsTotal}</span>
              </div>
              <div className="h-px bg-bone overflow-hidden">
                <div
                  className="h-full bg-pine transition-all duration-500"
                  style={{ width: `${((user.deliveriesRemaining ?? 0) / plan.mealsTotal) * 100}%` }}
                />
              </div>
            </div>
            {activeAddOns.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {activeAddOns.map(a => a && (
                  <span key={a.id} className="font-sans text-[10px] uppercase tracking-widest border border-goldenrod/40 text-coyote px-3 py-1 rounded-full">
                    {a.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="glass grain rounded-2xl overflow-hidden divide-y divide-bone/50">
          {[
            { label: 'Pause subscription', Icon: Pause },
            { label: 'Skip a specific day', Icon: SkipForward },
            { label: 'Change plan', Icon: ArrowUpDown },
          ].map(({ label, Icon }) => (
            <button key={label} className="flex items-center gap-4 w-full px-6 py-4 min-h-[56px] active:bg-bone/20 transition-colors">
              <Icon size={16} strokeWidth={1.5} className="text-slate" />
              <span className="font-sans text-sm text-charcoal flex-1 text-left">{label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bone">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
          <button
            onClick={() => setCancelModal(true)}
            className="flex items-center gap-4 w-full px-6 py-4 min-h-[56px] active:bg-red-50/30 transition-colors"
          >
            <X size={16} strokeWidth={1.5} className="text-red-400" />
            <span className="font-sans text-sm text-red-400 flex-1 text-left">End subscription</span>
          </button>
        </div>

        {/* Dietary profile */}
        <div className="glass grain rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-sans text-[10px] uppercase tracking-widest text-slate">Dietary profile</span>
            <button className="font-sans text-xs text-pine flex items-center gap-1">
              <Edit2 size={12} strokeWidth={1.5} /> Edit
            </button>
          </div>
          {user.dietary?.allergens?.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {user.dietary.allergens.map(a => (
                <span key={a.name} className={`font-sans text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                  a.severity === 'severe'
                    ? 'border-red-400/30 text-red-400'
                    : 'border-goldenrod/30 text-coyote'
                }`}>
                  {a.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="font-sans text-sm text-slate/60 italic">No considerations noted</p>
          )}
          {user.dietary?.freeText && (
            <p className="font-sans text-xs text-slate italic mt-2">"{user.dietary.freeText}"</p>
          )}
        </div>

        {/* Address */}
        {user.address && (
          <div className="glass grain rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-sans text-[10px] uppercase tracking-widest text-slate">Delivery address</span>
              <button className="font-sans text-xs text-pine flex items-center gap-1">
                <Edit2 size={12} strokeWidth={1.5} /> Edit
              </button>
            </div>
            <p className="font-sans text-sm text-charcoal">{user.address.label} — {user.address.line1}</p>
            <p className="font-sans text-xs text-slate mt-0.5">{user.address.city} {user.address.pincode}</p>
            <p className="font-sans text-xs text-slate/60 italic mt-1">{user.address.timeWindow}</p>
          </div>
        )}
      </div>

      <BottomNav />

      <AnimatePresence>
        {cancelModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />
            <motion.div
              className="relative glass-dark grain rounded-3xl p-8 w-full max-w-xs"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <h2 className="font-serif text-2xl text-cream mb-2">End subscription?</h2>
              <p className="font-sans text-sm text-cream/60 leading-relaxed mb-6">
                {user.deliveriesRemaining} deliveries remain. This will stop future renewals.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setCancelModal(false)} className="flex-1 py-3 rounded-xl border border-cream/20 text-cream font-sans text-sm min-h-[48px]">
                  Keep it
                </button>
                <button onClick={() => setCancelModal(false)} className="flex-1 py-3 rounded-xl bg-red-500/80 text-cream font-sans text-sm min-h-[48px]">
                  End
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

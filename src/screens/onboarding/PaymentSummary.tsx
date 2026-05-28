import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { ADD_ONS } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage, getNextMonday } from '../../lib/storage';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Card', icon: '💳' },
  { id: 'netbanking', label: 'Netbanking', icon: '🏦' },
  { id: 'autopay', label: 'UPI Autopay', icon: '🔄' },
];

export default function PaymentSummary() {
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const plan = user?.plan;
  const address = user?.address;

  const [payMethod, setPayMethod] = useState('upi');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!plan || !address) return null;

  const mealCount = plan.mealsTotal;
  const addOnsTotal = (user?.addOns ?? []).reduce((sum, ao) => {
    if (!ao.selected) return sum;
    const def = ADD_ONS.find(a => a.id === ao.id);
    return sum + (def ? def.pricePerMeal * mealCount : 0);
  }, 0);
  const total = plan.basePrice + addOnsTotal;
  const deliveryDate = getNextMonday();

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      saveUserToStorage({
        onboarded: true,
        subscriptionStartDate: deliveryDate,
        deliveriesRemaining: mealCount,
        wallet: 0,
      });
      setTimeout(() => {
        navigate('/', { replace: true });
        window.location.reload();
      }, 3000);
    }, 1500);
  };

  return (
    <Layout title="The summary" subtitle="Review before confirming" showBack>
      <div className="space-y-5 pb-32">

        {/* Breakdown */}
        <div className="glass grain rounded-2xl overflow-hidden">
          <div className="bg-pine px-6 py-5">
            <p className="font-serif text-xl text-cream">{plan.name}</p>
            <p className="font-sans text-xs text-cream/60 uppercase tracking-widest mt-1">
              {user?.selectedDays?.join(', ') ?? 'Mon–Fri'} · commencing {deliveryDate}
            </p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm text-slate">{user?.mealsPerDay ?? 1} meal/day</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-sans text-sm text-slate">Base</span>
              <span className="font-sans text-sm text-charcoal">₹{plan.basePrice.toLocaleString()}</span>
            </div>
            {addOnsTotal > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-sans text-sm text-slate">Enhancements</span>
                <span className="font-sans text-sm text-charcoal">₹{addOnsTotal}</span>
              </div>
            )}
            <div className="border-t border-bone pt-3">
              <p className="font-sans text-[10px] uppercase tracking-widest text-slate mb-1">First cycle</p>
              <p className="font-serif text-3xl text-pine">₹{total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className="glass grain rounded-2xl px-6 py-4">
          <p className="font-sans text-[10px] uppercase tracking-widest text-slate mb-2">Delivery</p>
          <p className="font-sans text-sm text-charcoal">{address.label} — {address.line1}, {address.city}</p>
          <p className="font-sans text-xs text-slate mt-1">{address.timeWindow}</p>
        </div>

        {/* Renewal */}
        <p className="font-sans text-xs text-slate/70 italic text-center px-4">
          Renews weekly. Pause anytime.
        </p>

        {/* Payment methods */}
        <div>
          <p className="font-sans text-xs uppercase tracking-widest text-slate mb-3">Payment method</p>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map(pm => (
              <button
                key={pm.id}
                onClick={() => setPayMethod(pm.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all min-h-[52px] ${
                  payMethod === pm.id
                    ? 'glass grain ring-1 ring-pine/30 border-pine/20'
                    : 'border-bone bg-transparent'
                }`}
              >
                <span>{pm.icon}</span>
                <span className="font-sans text-sm text-charcoal">{pm.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Agree */}
        <button onClick={() => setAgreed(!agreed)} className="flex items-start gap-3 w-full text-left">
          <div className={`w-5 h-5 rounded-md border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
            agreed ? 'bg-pine border-pine' : 'border-bone'
          }`}>
            {agreed && <Check size={11} color="#F7F1E1" strokeWidth={3} />}
          </div>
          <span className="font-sans text-xs text-slate/70 leading-relaxed">
            I agree to auto-renewal and the GreenFeast subscription terms
          </span>
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 pb-8 pt-4 bg-gradient-to-t from-cream to-transparent">
        <Button
          onClick={handlePay}
          fullWidth
          variant="accent"
          disabled={!agreed || loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              One moment...
            </span>
          ) : (
            'Confirm subscription'
          )}
        </Button>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-pine/90 backdrop-blur-md" />
            <motion.div
              className="relative text-center"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full border border-goldenrod/40 flex items-center justify-center mx-auto mb-6">
                <Check size={28} className="text-goldenrod" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-cream mb-2">Welcome to the table.</h2>
              <p className="font-sans text-xs text-cream/60 uppercase tracking-widest mb-1">Your first arrival</p>
              <p className="font-serif text-xl text-goldenrod-light">{deliveryDate}</p>
              <p className="font-sans text-xs text-cream/50 mt-4 italic">{address.label} — {address.line1}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

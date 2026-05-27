import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { ADD_ONS } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage, getNextMonday } from '../../lib/storage';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', emoji: '📱' },
  { id: 'card', label: 'Card', emoji: '💳' },
  { id: 'netbanking', label: 'Netbanking', emoji: '🏦' },
  { id: 'autopay', label: 'UPI Autopay', emoji: '🔄' },
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

  const orderId = `GF${Date.now().toString().slice(-6)}`;
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
    <Layout title="Review your order" showBack>
      <div className="space-y-4 pb-32">

        {/* Order breakdown */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="bg-[#1B5E20] px-4 py-3">
            <p className="text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {plan.name}
            </p>
            <p className="text-[#A5D6A7] text-xs mt-0.5">
              {(user?.selectedDays?.join(', ') ?? 'Mon–Fri')} · next week
            </p>
          </div>
          <div className="px-4 py-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">{user?.mealsPerDay ?? 1} meal/day</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Base price</span>
              <span className="font-medium">₹{plan.basePrice.toLocaleString()}</span>
            </div>
            {addOnsTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Add-ons</span>
                <span className="font-medium">₹{addOnsTotal}</span>
              </div>
            )}
            <div className="border-t border-[#E5E7EB] pt-2 flex justify-between">
              <span className="font-bold text-[#1A1A1A]">Subtotal</span>
              <span className="font-bold text-[#1B5E20]">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="bg-[#E8F5E9] rounded-2xl px-4 py-3 space-y-1">
          <p className="text-xs font-semibold text-[#1B5E20] uppercase tracking-wide">Delivery</p>
          <p className="text-sm text-[#1A1A1A]">
            {address.label} — {address.line1}, {address.city}
          </p>
          <p className="text-sm text-[#6B7280]">{address.timeWindow}</p>
        </div>

        {/* Total */}
        <div className="bg-[#1B5E20] rounded-2xl px-4 py-4">
          <p className="text-white text-sm opacity-80">Total for first cycle</p>
          <p className="text-white text-2xl font-bold mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            ₹{total.toLocaleString()}
          </p>
          <p className="text-[#A5D6A7] text-xs mt-1">
            🔄 Next cycle: ₹{total.toLocaleString()} every {plan.id === 'trial' ? 'week' : 'month'}
          </p>
        </div>

        {/* Payment methods */}
        <div>
          <p className="font-semibold text-[#1A1A1A] mb-3 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Payment method
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map(pm => (
              <button
                key={pm.id}
                onClick={() => setPayMethod(pm.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 min-h-[48px] transition-all ${
                  payMethod === pm.id ? 'border-[#1B5E20] bg-[#E8F5E9]' : 'border-[#E5E7EB] bg-white'
                }`}
              >
                <span className="text-base">{pm.emoji}</span>
                <span className="text-sm font-medium text-[#1A1A1A]">{pm.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Terms */}
        <button
          onClick={() => setAgreed(!agreed)}
          className="flex items-start gap-3 w-full text-left"
        >
          <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
            agreed ? 'bg-[#1B5E20] border-[#1B5E20]' : 'border-[#D1D5DB]'
          }`}>
            {agreed && <Check size={12} color="white" strokeWidth={3} />}
          </div>
          <span className="text-xs text-[#6B7280] leading-relaxed">
            I agree to auto-renewal and the GreenFeast subscription terms
          </span>
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FDF9E8] to-transparent">
        <Button onClick={handlePay} fullWidth disabled={!agreed || loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            'Proceed to Payment'
          )}
        </Button>
      </div>

      {/* Success overlay */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="bg-white rounded-3xl p-8 text-center max-w-xs w-full shadow-2xl">
            <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={36} className="text-[#1B5E20]" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Order confirmed!
            </h2>
            <p className="text-sm text-[#6B7280] mb-1">Order ID: <span className="font-semibold text-[#1A1A1A]">{orderId}</span></p>
            <p className="text-sm text-[#6B7280] mb-1">First delivery: <span className="font-semibold text-[#1A1A1A]">{deliveryDate}</span></p>
            <p className="text-sm text-[#6B7280]">{address.label} — {address.line1}</p>
            <p className="text-xs text-[#9CA3AF] mt-4">Taking you home in a moment…</p>
          </div>
        </div>
      )}
    </Layout>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Layout from '../../components/Layout';
import { ADD_ONS } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage, getNextMonday } from '../../lib/storage';

const WHATSAPP_URL = 'https://wa.me/918829040566';

export default function OrderPayment() {
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const plan = user?.plan;

  const [method, setMethod] = useState<'upi' | 'cash' | null>(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!plan) return null;

  const mealCount = plan.mealsTotal;
  const addOnsTotal = (user?.addOns ?? []).reduce((sum, ao) => {
    if (!ao.selected) return sum;
    const def = ADD_ONS.find(a => a.id === ao.id);
    return sum + (def ? def.pricePerMeal * mealCount : 0);
  }, 0);
  const total = plan.basePrice + addOnsTotal;

  const orderId = `GF${Date.now().toString().slice(-6)}`;
  const deliveryDate = getNextMonday();

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    `upi://pay?pa=greenfeast@ybl&pn=GreenFeast&am=${total}&cu=INR&tn=Order${orderId}`
  )}`;

  const handleIVePaid = () => {
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
    }, 1200);
  };

  return (
    <Layout title="Payment" showBack>
      <div className="space-y-3 pb-32">

        <p className="text-sm text-[#6B7280]">
          Amount due: <span className="font-bold text-[#1B5E20]">₹{total.toLocaleString()}</span>
        </p>

        {/* UPI option */}
        <div
          className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
            method === 'upi' ? 'border-[#1B5E20]' : 'border-[#E5E7EB]'
          }`}
        >
          <button
            onClick={() => setMethod(method === 'upi' ? null : 'upi')}
            className="w-full flex items-center gap-3 px-4 py-4 bg-white min-h-[56px]"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              method === 'upi' ? 'border-[#1B5E20] bg-[#1B5E20]' : 'border-[#D1D5DB]'
            }`}>
              {method === 'upi' && <Check size={10} color="white" strokeWidth={3.5} />}
            </div>
            <span className="text-xl">📱</span>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Pay via UPI
              </p>
              <p className="text-xs text-[#6B7280]">Scan QR with any UPI app</p>
            </div>
          </button>

          {method === 'upi' && (
            <div className="bg-[#F9FAFB] border-t border-[#E5E7EB] px-4 py-5 flex flex-col items-center gap-4">
              <p className="text-xs text-[#6B7280] text-center">
                Scan with PhonePe, GPay, Paytm or any UPI app
              </p>
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-[#E5E7EB]">
                <img
                  src={qrUrl}
                  alt="UPI QR Code"
                  className="w-[200px] h-[200px] rounded-lg"
                />
              </div>
              <p className="text-xs font-medium text-[#1B5E20]">greenfeast@ybl · ₹{total.toLocaleString()}</p>

              <button
                onClick={() => setPaid(!paid)}
                className="flex items-center gap-2 text-sm text-[#6B7280]"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  paid ? 'bg-[#1B5E20] border-[#1B5E20]' : 'border-[#D1D5DB]'
                }`}>
                  {paid && <Check size={11} color="white" strokeWidth={3} />}
                </div>
                I have completed the payment
              </button>

              <button
                onClick={handleIVePaid}
                disabled={!paid || loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all min-h-[48px] ${
                  paid && !loading
                    ? 'bg-[#1B5E20] text-white'
                    : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Confirming...
                  </span>
                ) : 'Confirm payment →'}
              </button>
            </div>
          )}
        </div>

        {/* Cash option */}
        <div
          className={`rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
            method === 'cash' ? 'border-[#1B5E20]' : 'border-[#E5E7EB]'
          }`}
        >
          <button
            onClick={() => setMethod(method === 'cash' ? null : 'cash')}
            className="w-full flex items-center gap-3 px-4 py-4 bg-white min-h-[56px]"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              method === 'cash' ? 'border-[#1B5E20] bg-[#1B5E20]' : 'border-[#D1D5DB]'
            }`}>
              {method === 'cash' && <Check size={10} color="white" strokeWidth={3.5} />}
            </div>
            <span className="text-xl">💵</span>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Cash on delivery
              </p>
              <p className="text-xs text-[#6B7280]">Pay on your first delivery</p>
            </div>
          </button>

          {method === 'cash' && (
            <div className="bg-[#F9FAFB] border-t border-[#E5E7EB] px-4 py-5 space-y-3">
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Keep <span className="font-semibold text-[#1A1A1A]">₹{total.toLocaleString()}</span> ready for your first delivery. Our delivery partner will collect the amount.
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm min-h-[48px]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Confirm on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Success overlay */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="bg-white rounded-3xl p-8 text-center max-w-xs w-full shadow-2xl">
            <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={36} className="text-[#1B5E20]" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Order confirmed! 🎉
            </h2>
            <p className="text-sm text-[#6B7280] mb-1">
              Order ID: <span className="font-semibold text-[#1A1A1A]">{orderId}</span>
            </p>
            <p className="text-sm text-[#6B7280] mb-1">
              First delivery: <span className="font-semibold text-[#1A1A1A]">{deliveryDate}</span>
            </p>
            <p className="text-xs text-[#9CA3AF] mt-4">Taking you to your dashboard…</p>
          </div>
        </div>
      )}
    </Layout>
  );
}

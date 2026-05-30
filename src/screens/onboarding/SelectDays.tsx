import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { DAYS_OF_WEEK } from '../../data/menu';
import { saveUserToStorage } from '../../lib/storage';

type DeliveryMode = 'opt-in' | 'opt-out';

export default function SelectDays() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<DeliveryMode>('opt-out');

  const handleNext = () => {
    // opt-out: all days active by default; opt-in: no days active by default
    const defaultDays = mode === 'opt-out' ? [...DAYS_OF_WEEK] : [];
    saveUserToStorage({ deliveryMode: mode, selectedDays: defaultDays } as Parameters<typeof saveUserToStorage>[0]);
    navigate('/address');
  };

  return (
    <Layout title="Delivery preference" subtitle="How would you like to manage your deliveries?" showBack>
      <div className="space-y-4 pb-32">

        {/* Opt-out card */}
        <button
          onClick={() => setMode('opt-out')}
          className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-150 bg-white ${
            mode === 'opt-out' ? 'border-[#1B5E20] shadow-md' : 'border-[#E5E7EB]'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
              mode === 'opt-out' ? 'border-[#1B5E20] bg-[#1B5E20]' : 'border-[#D1D5DB]'
            }`}>
              {mode === 'opt-out' && <Check size={10} color="white" strokeWidth={3.5} />}
            </div>
            <div>
              <p className="font-bold text-sm text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Deliver every day — I'll skip when I don't want
              </p>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                You'll get a meal every day Mon–Sat by default. From your plan, just tap any day to skip that delivery.
              </p>
              <span className="inline-block mt-2.5 text-[10px] font-semibold bg-[#E8F5E9] text-[#1B5E20] px-2.5 py-1 rounded-full uppercase tracking-wide">
                Most popular
              </span>
            </div>
          </div>
        </button>

        {/* Opt-in card */}
        <button
          onClick={() => setMode('opt-in')}
          className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-150 bg-white ${
            mode === 'opt-in' ? 'border-[#1B5E20] shadow-md' : 'border-[#E5E7EB]'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
              mode === 'opt-in' ? 'border-[#1B5E20] bg-[#1B5E20]' : 'border-[#D1D5DB]'
            }`}>
              {mode === 'opt-in' && <Check size={10} color="white" strokeWidth={3.5} />}
            </div>
            <div>
              <p className="font-bold text-sm text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                No delivery by default — I'll request when I want
              </p>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                No meals by default. From your plan, tap any day to activate that day's delivery.
              </p>
            </div>
          </div>
        </button>

        <p className="text-xs text-[#9CA3AF] text-center px-4 leading-relaxed">
          You can change individual days anytime from your plan before 8 PM the night before.
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FDF9E8] to-transparent">
        <Button onClick={handleNext} fullWidth>
          Continue →
        </Button>
      </div>
    </Layout>
  );
}

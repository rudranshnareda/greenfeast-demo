import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { DAYS_OF_WEEK } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';

type DeliveryMode = 'opt-in' | 'opt-out';

const ALL_DAYS = DAYS_OF_WEEK; // Mon–Sat

export default function SelectDays() {
  const navigate = useNavigate();
  const user = getUserFromStorage();

  const [mode, setMode] = useState<DeliveryMode>('opt-out');
  // opt-in: user picks days they WANT; opt-out: user picks days to SKIP (starts all selected)
  const [selectedDays, setSelectedDays] = useState<string[]>(
    user?.selectedDays?.length ? user.selectedDays : ALL_DAYS
  );

  const handleModeChange = (m: DeliveryMode) => {
    setMode(m);
    // reset days to sensible default for each mode
    if (m === 'opt-out') setSelectedDays([...ALL_DAYS]);
    else setSelectedDays([]);
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const deliveryDays = mode === 'opt-in' ? selectedDays : selectedDays;
  // opt-in: selectedDays = days with delivery
  // opt-out: selectedDays = days NOT skipped = delivery days

  const handleNext = () => {
    saveUserToStorage({ selectedDays: deliveryDays, deliveryMode: mode } as Parameters<typeof saveUserToStorage>[0]);
    navigate('/address');
  };

  return (
    <Layout title="Delivery preference" showBack>
      <div className="space-y-5 pb-32">

        {/* Mode selection */}
        <div className="space-y-3">
          {/* Opt-out card */}
          <button
            onClick={() => handleModeChange('opt-out')}
            className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-150 bg-white ${
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
                  Choose when you don't want
                </p>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                  You get a meal every day by default. Select the days you want to skip.
                </p>
              </div>
            </div>
          </button>

          {/* Opt-in card */}
          <button
            onClick={() => handleModeChange('opt-in')}
            className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-150 bg-white ${
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
                  Choose when you want
                </p>
                <p className="text-xs text-[#6B7280] mt-0.5 leading-relaxed">
                  No meal by default. Select the days you'd like a delivery.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Day picker */}
        <div>
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
            {mode === 'opt-out' ? 'Tap a day to skip it' : 'Tap a day to add it'}
          </p>
          <div className="flex gap-2 flex-wrap">
            {ALL_DAYS.map(day => {
              const isDelivery = mode === 'opt-out'
                ? selectedDays.includes(day)   // opt-out: selected = will deliver
                : selectedDays.includes(day);  // opt-in:  selected = will deliver

              const label = mode === 'opt-out'
                ? (isDelivery ? day : `${day} ✕`)
                : day;

              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-5 py-3 rounded-full font-semibold text-sm transition-all duration-150 min-h-[44px] min-w-[64px] ${
                    isDelivery
                      ? 'bg-[#1B5E20] text-white shadow-sm'
                      : 'bg-white text-[#9CA3AF] border-2 border-[#E5E7EB] line-through'
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <button disabled className="px-5 py-3 rounded-full font-semibold text-sm bg-[#F3F4F6] text-[#D1D5DB] border border-[#E5E7EB] cursor-not-allowed min-h-[44px] min-w-[64px]">
              Sun
            </button>
          </div>
        </div>

        {/* Summary chip */}
        <div className="bg-[#E8F5E9] rounded-2xl p-4">
          <p className="text-sm text-[#6B7280]">Delivery days</p>
          <p className="text-lg font-bold text-[#1B5E20] mt-0.5">
            {deliveryDays.length === 0
              ? 'No days selected'
              : deliveryDays.join(', ')}
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FDF9E8] to-transparent">
        <Button
          onClick={handleNext}
          fullWidth
          disabled={deliveryDays.length === 0}
        >
          Continue →
        </Button>
      </div>
    </Layout>
  );
}

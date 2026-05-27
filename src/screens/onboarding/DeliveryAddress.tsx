import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { TIME_WINDOWS } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';
import type { Address } from '../../types';

export default function DeliveryAddress() {
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const existing = user?.address;

  const [label, setLabel] = useState(existing?.label ?? 'Home');
  const [type, setType] = useState<'office' | 'residence'>(existing?.type ?? 'residence');
  const [line1, setLine1] = useState(existing?.line1 ?? '');
  const [pincode, setPincode] = useState(existing?.pincode ?? '');
  const [landmark, setLandmark] = useState(existing?.landmark ?? '');
  const [timeWindow, setTimeWindow] = useState(existing?.timeWindow ?? TIME_WINDOWS[0]);
  const [errors, setErrors] = useState<{ line1?: string; pincode?: string }>({});

  const validate = () => {
    const errs: { line1?: string; pincode?: string } = {};
    if (!line1.trim()) errs.line1 = 'Please enter your street address';
    if (!/^\d{6}$/.test(pincode)) errs.pincode = 'Enter a valid 6-digit pincode';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    const address: Address = { label, type, line1, city: 'Jaipur', pincode, landmark, timeWindow };
    saveUserToStorage({ address });
    navigate('/payment');
  };

  const INPUT =
    'w-full bg-white border border-[#E5E7EB] rounded-xl px-4 min-h-[52px] text-base text-[#1A1A1A] placeholder-[#9CA3AF] outline-none focus:border-[#1B5E20] transition-colors';

  return (
    <Layout title="Where should we deliver?" showBack>
      <div className="space-y-5 pb-32">

        {/* Address fields */}
        <div className="space-y-3">
          <input
            type="text"
            value={line1}
            onChange={e => { setLine1(e.target.value); setErrors(p => ({ ...p, line1: undefined })); }}
            placeholder="Street address"
            className={INPUT}
          />
          {errors.line1 && <p className="text-red-500 text-xs -mt-1">{errors.line1}</p>}

          <div className="flex gap-3">
            <input
              type="text"
              value="Jaipur"
              readOnly
              className={`${INPUT} flex-1 opacity-60`}
            />
            <input
              type="tel"
              inputMode="numeric"
              maxLength={6}
              value={pincode}
              onChange={e => { setPincode(e.target.value.replace(/\D/g, '')); setErrors(p => ({ ...p, pincode: undefined })); }}
              placeholder="Pincode"
              className={`${INPUT} flex-1`}
            />
          </div>
          {errors.pincode && <p className="text-red-500 text-xs -mt-1">{errors.pincode}</p>}

          <input
            type="text"
            value={landmark}
            onChange={e => setLandmark(e.target.value)}
            placeholder="Landmark (optional)"
            className={INPUT}
          />
        </div>

        {/* Address type toggle */}
        <div>
          <p className="font-semibold text-[#1A1A1A] mb-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Address type
          </p>
          <div className="flex gap-3">
            {(['residence', 'office'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setType(t); setLabel(t === 'residence' ? 'Home' : 'Office'); }}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold capitalize min-h-[44px] transition-all ${
                  type === t ? 'bg-[#1B5E20] text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'
                }`}
              >
                {t === 'residence' ? '🏠 Home' : '🏢 Office'}
              </button>
            ))}
          </div>
        </div>

        {/* Custom label */}
        <div>
          <p className="font-semibold text-[#1A1A1A] mb-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Save as
          </p>
          <div className="flex gap-2 flex-wrap">
            {['Home', 'Office', 'Other'].map(l => (
              <button
                key={l}
                onClick={() => setLabel(l)}
                className={`px-4 py-2 rounded-full text-sm font-semibold min-h-[40px] transition-all border ${
                  label === l ? 'bg-[#1B5E20] text-white border-[#1B5E20]' : 'bg-white text-[#6B7280] border-[#E5E7EB]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Time window */}
        <div>
          <p className="font-semibold text-[#1A1A1A] mb-2 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Preferred delivery time
          </p>
          <div className="space-y-2">
            {TIME_WINDOWS.map(tw => (
              <button
                key={tw}
                onClick={() => setTimeWindow(tw)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 min-h-[48px] transition-all ${
                  timeWindow === tw ? 'border-[#1B5E20] bg-[#E8F5E9]' : 'border-[#E5E7EB] bg-white'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  timeWindow === tw ? 'border-[#1B5E20]' : 'border-[#D1D5DB]'
                }`}>
                  {timeWindow === tw && <div className="w-2 h-2 rounded-full bg-[#1B5E20]" />}
                </div>
                <span className="text-sm text-[#1A1A1A]">{tw}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-[#6B7280] mt-2">
            Orders must be finalized by 8 PM the night before delivery.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FDF9E8] to-transparent">
        <Button onClick={handleNext} fullWidth>
          Review & pay →
        </Button>
      </div>
    </Layout>
  );
}

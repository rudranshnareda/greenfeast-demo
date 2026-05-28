import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { TIME_WINDOWS } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';
import type { Address } from '../../types';

const UNDERLINE = 'w-full bg-transparent border-b border-bone focus:border-pine outline-none py-3 font-sans text-charcoal placeholder:text-slate/50 text-sm transition-colors';
const LABEL = 'font-sans text-xs uppercase tracking-widest text-slate mb-1 block';

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
    if (!line1.trim()) errs.line1 = 'Please enter a street address';
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

  return (
    <Layout title="The address" subtitle="Where shall we arrive?" showBack>
      <div className="space-y-8 pb-32">

        {/* Address fields */}
        <div className="space-y-5">
          <div>
            <label className={LABEL}>Street address</label>
            <input
              type="text"
              value={line1}
              onChange={e => { setLine1(e.target.value); setErrors(p => ({ ...p, line1: undefined })); }}
              placeholder="Building, street name"
              className={UNDERLINE}
            />
            {errors.line1 && <p className="font-sans text-xs text-red-400 mt-1">{errors.line1}</p>}
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <label className={LABEL}>City</label>
              <input type="text" value="Jaipur" readOnly className={`${UNDERLINE} opacity-50`} />
            </div>
            <div className="flex-1">
              <label className={LABEL}>Pincode</label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={e => { setPincode(e.target.value.replace(/\D/g, '')); setErrors(p => ({ ...p, pincode: undefined })); }}
                placeholder="302001"
                className={UNDERLINE}
              />
              {errors.pincode && <p className="font-sans text-xs text-red-400 mt-1">{errors.pincode}</p>}
            </div>
          </div>

          <div>
            <label className={LABEL}>Landmark (optional)</label>
            <input
              type="text"
              value={landmark}
              onChange={e => setLandmark(e.target.value)}
              placeholder="Near, opposite, behind..."
              className={UNDERLINE}
            />
          </div>
        </div>

        {/* Address type */}
        <div>
          <label className={LABEL}>Address type</label>
          <div className="flex gap-3">
            {(['residence', 'office'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setType(t); setLabel(t === 'residence' ? 'Home' : 'Office'); }}
                className={`flex-1 py-3 rounded-xl font-sans text-xs uppercase tracking-widest min-h-[48px] transition-all border ${
                  type === t
                    ? 'bg-pine text-cream border-pine'
                    : 'border-bone text-slate bg-transparent'
                }`}
              >
                {t === 'residence' ? 'Residence' : 'Office'}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred hour */}
        <div>
          <label className={LABEL}>Preferred hour</label>
          <div className="space-y-2">
            {TIME_WINDOWS.map(tw => (
              <button
                key={tw}
                onClick={() => setTimeWindow(tw)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all min-h-[52px] ${
                  timeWindow === tw
                    ? 'glass grain ring-1 ring-pine/30 border-pine/20'
                    : 'border-bone bg-transparent'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  timeWindow === tw ? 'border-pine' : 'border-bone'
                }`}>
                  {timeWindow === tw && <div className="w-2 h-2 rounded-full bg-pine" />}
                </div>
                <span className="font-sans text-sm text-charcoal">{tw}</span>
              </button>
            ))}
          </div>
          <p className="font-sans text-xs text-slate/70 italic mt-3">
            Curate by 8 PM the evening before, and we'll handle the rest.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 pb-8 pt-4 bg-gradient-to-t from-cream to-transparent">
        <Button onClick={handleNext} fullWidth>Review →</Button>
      </div>
    </Layout>
  );
}

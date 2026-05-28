import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { PLANS } from '../../data/menu';
import type { Plan } from '../../types';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';

const PLAN_COPY: Record<string, { display: string; sub: string }> = {
  trial:   { display: 'The Trial',    sub: 'Five meals · Five days' },
  plan15:  { display: 'The Weekday',  sub: 'Fifteen meals · Three days a week' },
  plan30:  { display: 'The Devoted',  sub: 'Thirty meals · Six days a week' },
};

export default function PlanBuilder() {
  const navigate = useNavigate();
  const user = getUserFromStorage();

  const [selectedPlan, setSelectedPlan] = useState<Plan>(user?.plan ?? PLANS[1]);
  const [mealsPerDay, setMealsPerDay] = useState<number>(user?.mealsPerDay ?? 1);

  const handleNext = () => {
    saveUserToStorage({ plan: selectedPlan, mealsPerDay });
    if (selectedPlan.id === 'trial') navigate('/weekly-plan');
    else navigate('/select-days');
  };

  return (
    <Layout
      title="Your commitment"
      subtitle="Choose the rhythm that suits your life"
      showBack
    >
      <div className="space-y-4 pb-32">
        {PLANS.map(plan => {
          const active = selectedPlan.id === plan.id;
          const copy = PLAN_COPY[plan.id];
          return (
            <motion.button
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left glass grain rounded-2xl p-5 transition-all duration-200 ${
                active ? 'ring-1 ring-pine/40 shadow-md' : ''
              } relative`}
            >
              {plan.id === 'plan15' && (
                <span className="absolute top-4 right-4 font-sans text-[9px] uppercase tracking-widest border border-goldenrod/50 text-goldenrod px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
              <div className="flex items-center gap-3 pr-24">
                <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
                  active ? 'border-pine bg-pine' : 'border-bone'
                }`}>
                  {active && <Check size={10} color="#F7F1E1" strokeWidth={3} />}
                </div>
                <div>
                  <p className="font-serif text-xl text-ink leading-tight">{copy.display}</p>
                  <p className="font-sans text-xs text-slate mt-0.5">{copy.sub}</p>
                </div>
              </div>
              <div className="mt-3 ml-8">
                <p className="font-serif text-2xl text-pine">₹{plan.basePrice.toLocaleString()}</p>
                <p className="font-sans text-[10px] text-slate uppercase tracking-widest">per cycle</p>
              </div>
            </motion.button>
          );
        })}

        {/* Meals per day */}
        <div className="glass grain rounded-2xl p-5">
          <p className="font-sans text-xs text-slate uppercase tracking-widest mb-4">Meals per day</p>
          <div className="flex gap-3">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => setMealsPerDay(n)}
                className={`flex-1 py-3 rounded-xl font-sans text-sm tracking-wide transition-all duration-150 min-h-[48px] ${
                  mealsPerDay === n
                    ? 'bg-pine text-cream'
                    : 'bg-bone/40 text-charcoal border border-bone'
                }`}
              >
                {n === 3 ? '3+' : n}
              </button>
            ))}
          </div>
          {mealsPerDay > 1 && (
            <p className="font-sans text-xs text-coyote mt-3 italic">
              Multiple meals to one address receive a courtesy discount.
            </p>
          )}
        </div>

        {/* Subtotal */}
        <div className="px-2">
          <p className="font-sans text-xs text-slate uppercase tracking-widest">{selectedPlan.mealsTotal} meals · {mealsPerDay}/day</p>
          <p className="font-serif text-3xl text-pine mt-1">₹{selectedPlan.basePrice.toLocaleString()}</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 pb-8 pt-4 bg-gradient-to-t from-cream to-transparent">
        <Button onClick={handleNext} fullWidth>Select days →</Button>
      </div>
    </Layout>
  );
}

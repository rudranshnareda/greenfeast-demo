import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { PLANS } from '../../data/menu';
import type { Plan } from '../../types';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';

export default function PlanBuilder() {
  const navigate = useNavigate();
  const user = getUserFromStorage();

  const [selectedPlan, setSelectedPlan] = useState<Plan>(user?.plan ?? PLANS[1]);
  const [mealsPerDay, setMealsPerDay] = useState<number>(user?.mealsPerDay ?? 1);

  const total = selectedPlan.basePrice;

  const handleNext = () => {
    saveUserToStorage({ plan: selectedPlan, mealsPerDay });
    if (selectedPlan.id === 'trial') {
      navigate('/weekly-plan');
    } else {
      navigate('/select-days');
    }
  };

  return (
    <Layout title="Choose your plan" showBack>
      <div className="space-y-4 pb-32">
        {PLANS.map(plan => {
          const active = selectedPlan.id === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-150 bg-white relative ${
                active ? 'border-[#1B5E20] shadow-md' : 'border-[#E5E7EB]'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Radio indicator */}
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  active ? 'border-[#1B5E20] bg-[#1B5E20]' : 'border-[#D1D5DB]'
                }`}>
                  {active && <Check size={10} color="white" strokeWidth={3.5} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-base text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {plan.name}
                    </p>
                    {plan.id === 'plan15' && (
                      <span className="bg-[#FCD303] text-[#1A1A1A] text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#6B7280] mt-0.5">
                    {plan.mealsTotal} meals · {plan.daysPerWeek} days/week
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-[#1B5E20]">₹{plan.basePrice.toLocaleString()}</p>
                  <p className="text-xs text-[#6B7280]">per cycle</p>
                </div>
              </div>
            </button>
          );
        })}

        {/* Meals per day */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
          <p className="font-semibold text-[#1A1A1A] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Meals per day
          </p>
          <div className="flex gap-3">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => setMealsPerDay(n)}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-150 min-h-[44px] ${
                  mealsPerDay === n
                    ? 'bg-[#1B5E20] text-white'
                    : 'bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB]'
                }`}
              >
                {n === 3 ? '3+' : n}
              </button>
            ))}
          </div>
          {mealsPerDay > 1 && (
            <p className="text-xs text-[#1B5E20] mt-2 flex items-center gap-1">
              🎉 2+ meals to same address get a discount
            </p>
          )}
        </div>

        {/* Live subtotal */}
        <div className="bg-[#E8F5E9] rounded-2xl p-4">
          <p className="text-sm text-[#6B7280]">
            {selectedPlan.mealsTotal} meals × {mealsPerDay}/day
          </p>
          <p className="text-xl font-bold text-[#1B5E20] mt-1">
            ₹{total.toLocaleString()} <span className="text-sm font-normal text-[#6B7280]">base price</span>
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FDF9E8] to-transparent">
        <Button onClick={handleNext} fullWidth>
          Select days →
        </Button>
      </div>
    </Layout>
  );
}

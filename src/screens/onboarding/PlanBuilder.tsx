import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { PLANS, ADD_ONS } from '../../data/menu';
import type { Plan } from '../../types';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';

export default function PlanBuilder() {
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const mealPrice = user?.mealPricePerMeal ?? 250;

  const [selectedPlan, setSelectedPlan] = useState<Plan>(user?.plan ?? PLANS[1]);
  const [addOns, setAddOns] = useState<{ id: string; selected: boolean }[]>(
    user?.addOns?.length
      ? user.addOns
      : ADD_ONS.map(a => ({ id: a.id, selected: false }))
  );

  const planTotal = selectedPlan.mealsTotal * mealPrice;
  const addOnTotal = addOns.reduce((sum, ao) => {
    if (!ao.selected) return sum;
    const def = ADD_ONS.find(a => a.id === ao.id);
    return sum + (def ? def.pricePerMeal * selectedPlan.mealsTotal : 0);
  }, 0);
  const total = planTotal + addOnTotal;

  const toggleAddOn = (id: string) =>
    setAddOns(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a));

  const handleNext = () => {
    const computedPlan = { ...selectedPlan, basePrice: planTotal };
    saveUserToStorage({ plan: computedPlan, mealsPerDay: 1, addOns });
    navigate('/select-days');
  };

  return (
    <Layout title="Choose your plan" showBack>
      <div className="space-y-4 pb-32">
        {/* Plan options */}
        {PLANS.map(plan => {
          const active = selectedPlan.id === plan.id;
          const price = plan.mealsTotal * mealPrice;
          return (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-150 bg-white relative ${
                active ? 'border-[#1B5E20] shadow-md' : 'border-[#E5E7EB]'
              }`}
            >
              <div className="flex items-center gap-3">
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
                    {plan.mealsTotal} meals
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-[#1B5E20]">₹{price.toLocaleString()}</p>
                  <p className="text-xs text-[#6B7280]">per cycle</p>
                </div>
              </div>
            </button>
          );
        })}

        {/* Add-ons */}
        <div>
          <p className="font-semibold text-[#1A1A1A] mb-3 px-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Add-ons
          </p>
          <div className="space-y-2">
            {ADD_ONS.map(addOn => {
              const state = addOns.find(a => a.id === addOn.id);
              const isSelected = state?.selected ?? false;
              return (
                <button
                  key={addOn.id}
                  onClick={() => toggleAddOn(addOn.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all duration-150 min-h-[52px] bg-white ${
                    isSelected ? 'border-[#1B5E20] bg-[#E8F5E9]' : 'border-[#E5E7EB]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-[#1B5E20] border-[#1B5E20]' : 'border-[#D1D5DB]'
                  }`}>
                    {isSelected && <Check size={11} color="white" strokeWidth={3} />}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {addOn.name}
                    </p>
                    {addOn.description && (
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{addOn.description}</p>
                    )}
                  </div>
                  <span className={`text-sm font-semibold ${isSelected ? 'text-[#1B5E20]' : 'text-[#6B7280]'}`}>
                    +₹{addOn.pricePerMeal}/meal
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live total */}
        <div className="bg-[#E8F5E9] rounded-2xl p-4">
          <p className="text-sm text-[#6B7280]">
            {selectedPlan.mealsTotal} meals × ₹{mealPrice}
            {addOnTotal > 0 && <span className="text-[#1B5E20]"> + ₹{addOnTotal.toLocaleString()} add-ons</span>}
          </p>
          <p className="text-2xl font-bold text-[#1B5E20] mt-1">
            ₹{total.toLocaleString()}
            <span className="text-sm font-normal text-[#6B7280] ml-1">total</span>
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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { saveUserToStorage } from '../../lib/storage';

const MEAL_PLANS = [
  {
    id: 'high-protein',
    name: 'High Protein',
    tag: 'Best for muscle',
    pricePerMeal: 290,
    description: 'Extra protein portions added to every meal — more paneer, tofu & legumes.',
    highlights: ['25–30g protein/meal', 'Extra protein portions', 'Power-packed'],
  },
  {
    id: 'balanced',
    name: 'Balanced',
    tag: 'Most popular',
    pricePerMeal: 250,
    description: 'Perfectly balanced macros for everyday nutrition and clean eating.',
    highlights: ['Balanced macros', 'Chef curated', 'All goals'],
  },
  {
    id: 'light-clean',
    name: 'Light & Clean',
    tag: null,
    pricePerMeal: 250,
    description: 'Low calorie, high fibre meals. Great for weight loss and mindful eating.',
    highlights: ['Under 400 kcal', 'High fibre', 'Light portions'],
  },
];

export default function MealSelection() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('balanced');

  const handleNext = () => {
    const plan = MEAL_PLANS.find(p => p.id === selected)!;
    saveUserToStorage({ mealPricePerMeal: plan.pricePerMeal });
    navigate('/plan');
  };

  return (
    <Layout title="Your meal plan" subtitle="Select a plan that matches your goals" showBack>
      <div className="space-y-3 pb-32">
        {MEAL_PLANS.map(plan => {
          const active = selected === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-150 bg-white ${
                active ? 'border-[#1B5E20] shadow-md' : 'border-[#E5E7EB]'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Radio */}
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center ${
                  active ? 'border-[#1B5E20] bg-[#1B5E20]' : 'border-[#D1D5DB]'
                }`}>
                  {active && <Check size={10} color="white" strokeWidth={3.5} />}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name + tag + price row */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold text-base text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {plan.name}
                    </p>
                    {plan.tag && (
                      <span className="bg-[#FCD303] text-[#1A1A1A] text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                        {plan.tag}
                      </span>
                    )}
                    <span className="ml-auto font-bold text-[#1B5E20] text-sm whitespace-nowrap">
                      ₹{plan.pricePerMeal}/meal
                    </span>
                  </div>

                  <p className="text-xs text-[#6B7280] leading-relaxed mb-2.5">{plan.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5">
                    {plan.highlights.map(h => (
                      <span
                        key={h}
                        className={`text-xs px-2.5 py-1 rounded-full border ${
                          active
                            ? 'bg-[#E8F5E9] border-[#1B5E20]/20 text-[#1B5E20]'
                            : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280]'
                        }`}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FDF9E8] to-transparent">
        <Button onClick={handleNext} fullWidth>
          Continue →
        </Button>
      </div>
    </Layout>
  );
}

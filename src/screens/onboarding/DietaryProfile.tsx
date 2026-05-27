import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { ALLERGENS, ADD_ONS } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';

export default function DietaryProfile() {
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const plan = user?.plan;
  const mealCount = plan?.mealsTotal ?? 5;

  const [allergens, setAllergens] = useState<{ name: string; severity: 'mild' | 'severe' }[]>(
    user?.dietary?.allergens ?? []
  );
  const [freeText, setFreeText] = useState(user?.dietary?.freeText ?? '');
  const [addOns, setAddOns] = useState<{ id: string; selected: boolean; subOption?: string }[]>(
    user?.addOns?.length
      ? user.addOns
      : ADD_ONS.map(a => ({ id: a.id, selected: false }))
  );

  const toggleAllergen = (name: string) => {
    setAllergens(prev => {
      if (prev.some(a => a.name === name)) return prev.filter(a => a.name !== name);
      return [...prev, { name, severity: 'mild' }];
    });
  };

  const setSeverity = (name: string, severity: 'mild' | 'severe') => {
    setAllergens(prev => prev.map(a => a.name === name ? { ...a, severity } : a));
  };

  const toggleAddOn = (id: string) => {
    setAddOns(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  };

  const setSubOption = (id: string, subOption: string) => {
    setAddOns(prev => prev.map(a => a.id === id ? { ...a, subOption } : a));
  };

  const addOnTotal = addOns.reduce((sum, ao) => {
    if (!ao.selected) return sum;
    const def = ADD_ONS.find(a => a.id === ao.id);
    return sum + (def ? def.pricePerMeal * mealCount : 0);
  }, 0);

  const handleNext = () => {
    saveUserToStorage({ dietary: { allergens, freeText }, addOns });
    navigate('/address');
  };

  return (
    <Layout title="Tell us about your diet" showBack>
      <div className="space-y-6 pb-32">

        {/* Allergens */}
        <div>
          <p className="font-semibold text-[#1A1A1A] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Allergens & dislikes
          </p>
          <div className="space-y-2">
            {ALLERGENS.map(name => {
              const checked = allergens.some(a => a.name === name);
              const entry = allergens.find(a => a.name === name);
              return (
                <div key={name} className="bg-white rounded-2xl border border-[#E5E7EB] px-4 py-3">
                  <button
                    onClick={() => toggleAllergen(name)}
                    className="flex items-center gap-3 w-full min-h-[36px]"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      checked ? 'bg-[#1B5E20] border-[#1B5E20]' : 'border-[#D1D5DB]'
                    }`}>
                      {checked && <Check size={12} color="white" strokeWidth={3} />}
                    </div>
                    <span className="text-sm text-[#1A1A1A]">{name}</span>
                  </button>
                  {checked && (
                    <div className="flex gap-2 mt-2 ml-8">
                      {(['mild', 'severe'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setSeverity(name, s)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                            entry?.severity === s
                              ? s === 'severe' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-[#FFF59D] text-[#5D4037] border border-[#FCD303]'
                              : 'bg-[#F3F4F6] text-[#6B7280]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <textarea
            value={freeText}
            onChange={e => setFreeText(e.target.value)}
            placeholder="Any other constraints or dislikes?"
            rows={3}
            className="w-full mt-3 bg-white border border-[#E5E7EB] rounded-2xl px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] outline-none focus:border-[#1B5E20] transition-colors resize-none"
          />
        </div>

        {/* Add-ons */}
        <div>
          <p className="font-semibold text-[#1A1A1A] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Add-ons
          </p>
          <p className="text-xs text-[#6B7280] mb-3">Applied to every meal in your plan</p>
          <div className="space-y-2">
            {ADD_ONS.map(addOn => {
              const state = addOns.find(a => a.id === addOn.id);
              const selected = state?.selected ?? false;
              return (
                <div key={addOn.id} className={`bg-white rounded-2xl border-2 transition-all ${selected ? 'border-[#1B5E20]' : 'border-[#E5E7EB]'}`}>
                  <button
                    onClick={() => toggleAddOn(addOn.id)}
                    className="flex items-center gap-3 w-full px-4 py-3 min-h-[52px]"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      selected ? 'bg-[#1B5E20] border-[#1B5E20]' : 'border-[#D1D5DB]'
                    }`}>
                      {selected && <Check size={12} color="white" strokeWidth={3} />}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-[#1A1A1A]">{addOn.name}</p>
                      {addOn.description && <p className="text-xs text-[#6B7280]">{addOn.description}</p>}
                    </div>
                    <span className="text-sm font-semibold text-[#1B5E20]">+₹{addOn.pricePerMeal}/meal</span>
                  </button>
                  {selected && addOn.id === 'extra-cheese' && (
                    <div className="px-4 pb-3 flex gap-2">
                      {['Feta', 'Parmesan', 'Cheddar'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setSubOption(addOn.id, opt)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                            state?.subOption === opt
                              ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
                              : 'bg-white text-[#6B7280] border-[#E5E7EB]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Running total */}
        {addOnTotal > 0 && (
          <div className="bg-[#E8F5E9] rounded-2xl p-4">
            <p className="text-sm text-[#6B7280]">Add-ons total</p>
            <p className="text-xl font-bold text-[#1B5E20]">+₹{addOnTotal}</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FDF9E8] to-transparent">
        <Button onClick={handleNext} fullWidth>
          Add delivery address →
        </Button>
      </div>
    </Layout>
  );
}

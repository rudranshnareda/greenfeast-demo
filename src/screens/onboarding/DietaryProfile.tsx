import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { ALLERGENS, ADD_ONS } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';

export default function DietaryProfile() {
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const mealCount = user?.plan?.mealsTotal ?? 5;

  const [allergens, setAllergens] = useState<{ name: string; severity: 'mild' | 'severe' }[]>(
    user?.dietary?.allergens ?? []
  );
  const [freeText, setFreeText] = useState(user?.dietary?.freeText ?? '');
  const [addOns, setAddOns] = useState<{ id: string; selected: boolean; subOption?: string }[]>(
    user?.addOns?.length
      ? user.addOns
      : ADD_ONS.map(a => ({ id: a.id, selected: false }))
  );

  const addOnNames: Record<string, string> = {
    'extra-protein': 'Additional Protein',
    'extra-cheese': 'Aged Cheese',
    'exotic-fruits': 'Seasonal Cut Fruits',
  };
  const addOnDescriptions: Record<string, string> = {
    'extra-protein': '8–10g per meal',
    'extra-cheese': 'Feta, Parmesan, or Cheddar',
    'exotic-fruits': '',
  };

  const toggleAllergen = (name: string) => {
    setAllergens(prev =>
      prev.some(a => a.name === name)
        ? prev.filter(a => a.name !== name)
        : [...prev, { name, severity: 'mild' }]
    );
  };

  const setSeverity = (name: string, severity: 'mild' | 'severe') =>
    setAllergens(prev => prev.map(a => a.name === name ? { ...a, severity } : a));

  const toggleAddOn = (id: string) =>
    setAddOns(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a));

  const setSubOption = (id: string, subOption: string) =>
    setAddOns(prev => prev.map(a => a.id === id ? { ...a, subOption } : a));

  const addOnTotal = addOns.reduce((sum, ao) => {
    if (!ao.selected) return sum;
    const def = ADD_ONS.find(a => a.id === ao.id);
    return sum + (def ? def.pricePerMeal * mealCount : 0);
  }, 0);

  const handleNext = () => {
    saveUserToStorage({ dietary: { allergens, freeText }, addOns });
    navigate('/address');
  };

  const LABEL = 'font-sans text-xs uppercase tracking-widest text-slate mb-4 block';

  return (
    <Layout title="What we should know" subtitle="Preferences & enhancements" showBack>
      <div className="space-y-8 pb-32">

        {/* Considerations */}
        <div>
          <span className={LABEL}>Considerations</span>
          <div className="space-y-2">
            {ALLERGENS.map(name => {
              const checked = allergens.some(a => a.name === name);
              const entry = allergens.find(a => a.name === name);
              return (
                <div key={name} className="glass grain rounded-2xl px-5 py-3">
                  <button onClick={() => toggleAllergen(name)} className="flex items-center gap-3 w-full min-h-[40px]">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                      checked ? 'bg-pine border-pine' : 'border-bone'
                    }`}>
                      {checked && <Check size={11} color="#F7F1E1" strokeWidth={3} />}
                    </div>
                    <span className="font-sans text-sm text-charcoal">{name}</span>
                  </button>
                  {checked && (
                    <div className="flex gap-2 mt-2 ml-8">
                      {(['mild', 'severe'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setSeverity(name, s)}
                          className={`px-3 py-1 rounded-full font-sans text-xs tracking-wide capitalize transition-all border ${
                            entry?.severity === s
                              ? s === 'severe'
                                ? 'bg-red-900/20 text-red-400 border-red-400/30'
                                : 'bg-goldenrod/10 text-coyote border-goldenrod/30'
                              : 'text-slate border-bone'
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
            placeholder="Any other notes for the kitchen..."
            rows={3}
            className="w-full mt-3 bg-transparent border-b border-bone focus:border-pine outline-none py-3 font-sans text-sm text-charcoal placeholder:text-slate/50 resize-none transition-colors"
          />
        </div>

        {/* Enhancements */}
        <div>
          <span className={LABEL}>Enhancements</span>
          <div className="space-y-2">
            {ADD_ONS.map(addOn => {
              const state = addOns.find(a => a.id === addOn.id);
              const selected = state?.selected ?? false;
              const displayName = addOnNames[addOn.id] ?? addOn.name;
              const desc = addOnDescriptions[addOn.id] ?? '';
              return (
                <div key={addOn.id} className={`glass grain rounded-2xl transition-all ${selected ? 'ring-1 ring-pine/30' : ''}`}>
                  <button onClick={() => toggleAddOn(addOn.id)} className="flex items-center gap-3 w-full px-5 py-4 min-h-[56px]">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                      selected ? 'bg-pine border-pine' : 'border-bone'
                    }`}>
                      {selected && <Check size={11} color="#F7F1E1" strokeWidth={3} />}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-sans text-sm text-charcoal">{displayName}</p>
                      {desc && <p className="font-sans text-xs text-slate italic mt-0.5">{desc}</p>}
                    </div>
                    <span className="font-sans text-xs text-pine tracking-wide">+₹{addOn.pricePerMeal}/meal</span>
                  </button>
                  {selected && addOn.id === 'extra-cheese' && (
                    <div className="px-5 pb-4 flex gap-2">
                      {['Feta', 'Parmesan', 'Cheddar'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setSubOption(addOn.id, opt)}
                          className={`px-3 py-1.5 rounded-full font-sans text-xs tracking-wide border transition-all ${
                            state?.subOption === opt
                              ? 'bg-pine text-cream border-pine'
                              : 'text-slate border-bone'
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

        {addOnTotal > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-2"
          >
            <p className="font-sans text-xs text-slate uppercase tracking-widest">Enhancements total</p>
            <p className="font-serif text-2xl text-pine mt-1">+₹{addOnTotal}</p>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 pb-8 pt-4 bg-gradient-to-t from-cream to-transparent">
        <Button onClick={handleNext} fullWidth>Where to deliver →</Button>
      </div>
    </Layout>
  );
}

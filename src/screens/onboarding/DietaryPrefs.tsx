import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { ALLERGENS } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';

const DIETARY_OPTIONS = [
  { id: 'no-restriction', label: 'No restrictions' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'jain', label: 'Jain' },
];

export default function DietaryPrefs() {
  const navigate = useNavigate();
  const user = getUserFromStorage();

  const [dietaryPreference, setDietaryPreference] = useState(
    user?.dietaryPreference ?? 'no-restriction'
  );
  const [allergens, setAllergens] = useState<string[]>(
    user?.dietary?.allergens?.map(a => a.name) ?? []
  );

  const toggleAllergen = (name: string) => {
    setAllergens(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  const handleNext = () => {
    saveUserToStorage({
      dietaryPreference,
      dietary: {
        allergens: allergens.map(name => ({ name, severity: 'mild' as const })),
        freeText: '',
      },
    });
    navigate('/ai-loading');
  };

  return (
    <Layout title="Dietary preferences" subtitle="Help us personalise your meals" showBack>
      <div className="space-y-6 pb-32">
        {/* Dietary type */}
        <div>
          <p className="text-sm font-semibold text-[#1A1A1A] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            I eat
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DIETARY_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setDietaryPreference(opt.id)}
                className={`py-3.5 px-4 rounded-2xl border-2 font-semibold text-sm transition-all duration-150 min-h-[52px] ${
                  dietaryPreference === opt.id
                    ? 'border-[#1B5E20] bg-[#E8F5E9] text-[#1B5E20]'
                    : 'border-[#E5E7EB] bg-white text-[#1A1A1A]'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Allergens */}
        <div>
          <p className="text-sm font-semibold text-[#1A1A1A] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Any allergens?
          </p>
          <p className="text-xs text-[#9CA3AF] mb-3">Optional — we'll make sure to avoid these</p>
          <div className="space-y-2">
            {ALLERGENS.map(name => {
              const checked = allergens.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleAllergen(name)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all duration-150 min-h-[52px] ${
                    checked
                      ? 'border-[#1B5E20] bg-[#E8F5E9]'
                      : 'border-[#E5E7EB] bg-white'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    checked ? 'bg-[#1B5E20] border-[#1B5E20]' : 'border-[#D1D5DB]'
                  }`}>
                    {checked && <Check size={11} color="white" strokeWidth={3} />}
                  </div>
                  <span
                    className={`text-sm ${checked ? 'text-[#1B5E20] font-medium' : 'text-[#1A1A1A]'}`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FDF9E8] to-transparent">
        <Button onClick={handleNext} fullWidth>
          Continue →
        </Button>
      </div>
    </Layout>
  );
}

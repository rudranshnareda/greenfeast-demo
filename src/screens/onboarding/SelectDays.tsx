import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { DAYS_OF_WEEK } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';

export default function SelectDays() {
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const plan = user?.plan;
  const required = plan?.daysPerWeek ?? 3;

  const [selectedDays, setSelectedDays] = useState<string[]>(user?.selectedDays ?? []);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) return prev.filter(d => d !== day);
      if (prev.length >= required) return prev;
      return [...prev, day];
    });
  };

  const requiredLabel = required === 3 ? 'three' : 'six';

  const handleNext = () => {
    saveUserToStorage({ selectedDays });
    navigate('/weekly-plan');
  };

  return (
    <Layout
      title="When shall we arrive?"
      subtitle={`Select ${requiredLabel} days that anchor your week`}
      showBack
    >
      <div className="space-y-8 pb-32">
        <div className="flex flex-wrap gap-3">
          {DAYS_OF_WEEK.map(day => {
            const selected = selectedDays.includes(day);
            const disabled = !selected && selectedDays.length >= required;
            return (
              <motion.button
                key={day}
                onClick={() => toggleDay(day)}
                disabled={disabled}
                whileTap={disabled ? undefined : { scale: 0.95 }}
                className={`px-6 py-3 rounded-xl font-sans text-sm tracking-wide transition-all duration-150 min-h-[48px] min-w-[72px] ${
                  selected
                    ? 'bg-pine text-cream shadow-sm'
                    : disabled
                    ? 'bg-bone/30 text-slate/40 cursor-not-allowed border border-bone/40'
                    : 'glass grain text-pine border border-pine/20'
                }`}
              >
                {day}
              </motion.button>
            );
          })}
          <button disabled className="px-6 py-3 rounded-xl font-sans text-sm bg-bone/30 text-slate/30 border border-bone/30 cursor-not-allowed min-h-[48px] min-w-[72px] line-through">
            Sun
          </button>
        </div>

        {/* Summary */}
        <div className="px-2">
          <p className="font-sans text-xs text-slate uppercase tracking-widest">
            {selectedDays.length} of {required} days selected
          </p>
          <p className="font-serif text-3xl text-pine mt-1">
            ₹{(plan?.basePrice ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 pb-8 pt-4 bg-gradient-to-t from-cream to-transparent">
        <Button
          onClick={handleNext}
          fullWidth
          disabled={selectedDays.length !== required}
        >
          Select meals →
        </Button>
      </div>
    </Layout>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const pricePerCycle = plan?.basePrice ?? 0;
  const mealsPerDay = user?.mealsPerDay ?? 1;

  const handleNext = () => {
    saveUserToStorage({ selectedDays });
    navigate('/weekly-plan');
  };

  return (
    <Layout title="Pick your delivery days" showBack>
      <div className="space-y-6 pb-32">
        <p className="text-[#6B7280] text-sm">
          Select exactly <span className="font-semibold text-[#1B5E20]">{required} days</span>
        </p>

        <div className="flex gap-2 flex-wrap">
          {DAYS_OF_WEEK.map(day => {
            const selected = selectedDays.includes(day);
            const disabled = !selected && selectedDays.length >= required;
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                disabled={disabled}
                className={`px-5 py-3 rounded-full font-semibold text-sm transition-all duration-150 min-h-[44px] min-w-[64px] ${
                  selected
                    ? 'bg-[#1B5E20] text-white shadow-sm'
                    : disabled
                    ? 'bg-[#F3F4F6] text-[#D1D5DB] border border-[#E5E7EB] cursor-not-allowed'
                    : 'bg-white text-[#1B5E20] border-2 border-[#1B5E20]'
                }`}
              >
                {day}
              </button>
            );
          })}
          {/* Sunday always disabled */}
          <button
            disabled
            className="px-5 py-3 rounded-full font-semibold text-sm bg-[#F3F4F6] text-[#D1D5DB] border border-[#E5E7EB] cursor-not-allowed min-h-[44px] min-w-[64px] line-through"
          >
            Sun
          </button>
        </div>

        {/* Counter */}
        <div className="bg-[#E8F5E9] rounded-2xl p-4">
          <p className="text-sm text-[#6B7280]">
            {selectedDays.length} of {required} days selected · {mealsPerDay} meal/day
          </p>
          <p className="text-xl font-bold text-[#1B5E20] mt-1">
            ₹{pricePerCycle.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FDF9E8] to-transparent">
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

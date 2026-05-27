import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import Button from '../../components/Button';
import { MEALS, DEFAULT_BOWL_ROTATION } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';
import type { WeeklyMealPlan } from '../../types';

function buildDefaultPlan(days: string[]): WeeklyMealPlan {
  const plan: WeeklyMealPlan = {};
  days.forEach((day, i) => {
    plan[day] = DEFAULT_BOWL_ROTATION[i % DEFAULT_BOWL_ROTATION.length];
  });
  return plan;
}

export default function WeeklyPlan() {
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const plan = user?.plan;

  const days: string[] = plan?.id === 'trial'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    : user?.selectedDays ?? ['Mon', 'Wed', 'Fri'];

  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlan>(
    user?.weeklyMealPlan && Object.keys(user.weeklyMealPlan).length > 0
      ? user.weeklyMealPlan
      : buildDefaultPlan(days)
  );

  const [swapOpen, setSwapOpen] = useState(false);
  const [swapDay, setSwapDay] = useState<string | null>(null);

  const getMeal = (id: string) => MEALS.find(m => m.id === id);

  const handleSwap = (day: string, mealId: string) => {
    setWeeklyPlan(prev => ({ ...prev, [day]: mealId }));
    setSwapDay(null);
  };

  const handleNext = () => {
    saveUserToStorage({ weeklyMealPlan: weeklyPlan, selectedDays: days });
    navigate('/dietary');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDF9E8] flex flex-col">
      <header className="flex items-center gap-3 px-4 py-3 bg-[#FDF9E8] sticky top-0 z-10 border-b border-[#E5E7EB]">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center active:bg-[#E8F5E9]"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-[#1A1A1A] flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Your weekly meals
        </h1>
      </header>

      <div className="flex-1 px-4 pb-32 space-y-4 mt-4">
        {/* Note banner */}
        <div className="bg-[#FFF59D] rounded-2xl px-4 py-3 flex items-start gap-2">
          <span>📅</span>
          <p className="text-sm text-[#5D4037]">This week's meals change every Monday</p>
        </div>

        {/* Day rows */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {days.map((day, i) => {
            const mealId = weeklyPlan[day];
            const meal = getMeal(mealId);
            return (
              <div
                key={day}
                className={`flex items-center gap-3 px-4 py-3 ${i < days.length - 1 ? 'border-b border-[#F3F4F6]' : ''}`}
              >
                <span className="text-sm font-semibold text-[#6B7280] w-8 flex-shrink-0">{day}</span>
                {meal ? (
                  <>
                    <img src={meal.imageUrl} alt={meal.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">{meal.name}</p>
                      <p className="text-xs text-[#6B7280]">{meal.kcal} kcal · {meal.protein}g protein</p>
                    </div>
                    <button
                      onClick={() => setSwapDay(day)}
                      className="min-w-[36px] min-h-[36px] flex items-center justify-center"
                    >
                      <ChevronRight size={18} className="text-[#9CA3AF]" />
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-[#9CA3AF]">No meal selected</p>
                )}
              </div>
            );
          })}
        </div>

        <Button variant="secondary" fullWidth onClick={() => setSwapOpen(true)}>
          Change meals
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FDF9E8] to-transparent">
        <Button onClick={handleNext} fullWidth>
          Set dietary profile →
        </Button>
      </div>

      {/* Swap modal — pick day first */}
      {swapOpen && !swapDay && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setSwapOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>Change a meal</h2>
              <button onClick={() => setSwapOpen(false)} className="p-1"><X size={20} /></button>
            </div>
            <p className="text-sm text-[#6B7280] mb-3">Pick a day to change:</p>
            <div className="flex gap-2 flex-wrap">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setSwapDay(day)}
                  className="px-4 py-2 rounded-full border-2 border-[#1B5E20] text-[#1B5E20] text-sm font-semibold min-h-[44px]"
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Swap modal — pick meal */}
      {swapDay && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setSwapDay(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-t-3xl max-h-[75vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Choose meal for {swapDay}
              </h2>
              <button onClick={() => setSwapDay(null)} className="p-1"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 space-y-2">
              {MEALS.filter(m => m.category === 'bowl' || m.category === 'wrap' || m.category === 'salad').map(meal => (
                <button
                  key={meal.id}
                  onClick={() => { handleSwap(swapDay, meal.id); setSwapOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-colors ${
                    weeklyPlan[swapDay] === meal.id ? 'border-[#1B5E20] bg-[#E8F5E9]' : 'border-[#E5E7EB] bg-white'
                  }`}
                >
                  <img src={meal.imageUrl} alt={meal.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold text-[#1A1A1A]">{meal.name}</p>
                    <p className="text-xs text-[#6B7280]">{meal.kcal} kcal · ₹{meal.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

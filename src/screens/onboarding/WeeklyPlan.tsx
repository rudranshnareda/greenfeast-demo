import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
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

  const days: string[] =
    plan?.id === 'trial'
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
    <motion.div
      className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-cream via-cream to-bone/40 flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <header className="px-6 pt-8 pb-4 sticky top-0 z-10 bg-cream/80 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 mb-3 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center active:bg-bone/60"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-pine">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="font-serif text-3xl text-ink">Your week, plated</h1>
        <p className="font-sans text-xs text-slate uppercase tracking-widest mt-1">Review and curate</p>
      </header>

      <div className="flex-1 px-6 pb-32 space-y-5 mt-2">
        {/* Banner */}
        <div className="glass grain rounded-2xl px-5 py-4">
          <p className="font-sans text-xs text-coyote italic leading-relaxed">
            Menus refresh each Monday — a new rhythm, weekly.
          </p>
        </div>

        {/* Day rows */}
        <div className="glass grain rounded-2xl overflow-hidden">
          {days.map((day, i) => {
            const mealId = weeklyPlan[day];
            const meal = getMeal(mealId);
            return (
              <div
                key={day}
                className={`flex items-center gap-4 px-5 py-4 ${i < days.length - 1 ? 'border-b border-bone/50' : ''}`}
              >
                <span className="font-sans text-xs uppercase tracking-widest text-slate w-8 flex-shrink-0">{day}</span>
                {meal ? (
                  <>
                    <img src={meal.imageUrl} alt={meal.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-base text-ink truncate">{meal.name}</p>
                      <p className="font-sans text-[10px] text-slate uppercase tracking-widest">{meal.kcal} kcal</p>
                    </div>
                    <button onClick={() => setSwapDay(day)} className="min-w-[36px] min-h-[36px] flex items-center justify-center">
                      <ChevronRight size={16} strokeWidth={1.5} className="text-slate" />
                    </button>
                  </>
                ) : (
                  <p className="font-sans text-sm text-slate/60 italic">Unassigned</p>
                )}
              </div>
            );
          })}
        </div>

        <Button variant="secondary" fullWidth onClick={() => setSwapOpen(true)}>
          Curate
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 pb-8 pt-4 bg-gradient-to-t from-cream to-transparent">
        <Button onClick={handleNext} fullWidth>Refine your profile →</Button>
      </div>

      {/* Pick day sheet */}
      {swapOpen && !swapDay && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setSwapOpen(false)}
        >
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
          <motion.div
            className="relative glass-dark grain rounded-t-3xl p-6"
            initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl text-cream">Select a day to curate</h2>
              <button onClick={() => setSwapOpen(false)} className="p-1"><X size={18} className="text-cream/60" /></button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setSwapDay(day)}
                  className="px-5 py-3 rounded-xl border border-goldenrod/30 text-cream font-sans text-sm tracking-wide min-h-[48px] hover:bg-cream/10 transition-colors"
                >
                  {day}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Pick meal sheet */}
      {swapDay && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setSwapDay(null)}
        >
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
          <motion.div
            className="relative glass-dark grain rounded-t-3xl max-h-[75vh] flex flex-col"
            initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-cream/10">
              <h2 className="font-serif text-xl text-cream">{swapDay}</h2>
              <button onClick={() => setSwapDay(null)} className="p-1"><X size={18} className="text-cream/60" /></button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-2">
              {MEALS.filter(m => m.category !== 'smoothie').map(meal => (
                <button
                  key={meal.id}
                  onClick={() => { handleSwap(swapDay, meal.id); setSwapOpen(false); }}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-colors ${
                    weeklyPlan[swapDay] === meal.id
                      ? 'border-goldenrod/50 bg-cream/10'
                      : 'border-cream/10 hover:bg-cream/5'
                  }`}
                >
                  <img src={meal.imageUrl} alt={meal.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-serif text-base text-cream">{meal.name}</p>
                    <p className="font-sans text-[10px] text-cream/50 uppercase tracking-widest">{meal.kcal} kcal · ₹{meal.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

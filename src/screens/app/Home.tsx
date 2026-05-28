import { useState } from 'react';
import { MapPin, SkipForward, PauseCircle, PlusCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../../components/BottomNav';
import { MEALS } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';

function getGreeting(name: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name}.`;
  if (h < 17) return `Good afternoon, ${name}.`;
  return `Good evening, ${name}.`;
}

function getStatus(): { label: string; color: string } {
  const h = new Date().getHours();
  if (h < 11) return { label: 'In our kitchen', color: 'text-coyote bg-bone/60' };
  if (h < 14) return { label: 'On its way', color: 'text-pine bg-pine/10' };
  return { label: 'Delivered', color: 'text-pine bg-pine/10' };
}

export default function Home() {
  const user = getUserFromStorage()!;
  const status = getStatus();

  const days = user.selectedDays?.length ? user.selectedDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);

  const getMeal = (id: string) => MEALS.find(m => m.id === id);
  const [weeklyPlan, setWeeklyPlan] = useState(user.weeklyMealPlan ?? {});
  const [swapDay, setSwapDay] = useState<string | null>(null);

  const todayMealId = weeklyPlan[today] ?? Object.values(weeklyPlan)[0];
  const todayMeal = todayMealId ? getMeal(todayMealId) : MEALS[0];

  const handleSwap = (day: string, mealId: string) => {
    const updated = { ...weeklyPlan, [day]: mealId };
    setWeeklyPlan(updated);
    saveUserToStorage({ weeklyMealPlan: updated });
    setSwapDay(null);
  };

  return (
    <motion.div
      className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-cream via-cream to-bone/40"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header */}
      <header className="px-6 pt-10 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-3xl text-ink leading-tight">{getGreeting(user.name)}</h1>
            <div className="flex items-center gap-1 mt-1.5">
              <MapPin size={12} strokeWidth={1.5} className="text-slate" />
              <span className="font-sans text-xs text-slate uppercase tracking-widest">{user.address?.city ?? 'Jaipur'}</span>
            </div>
          </div>
          <img src="/logo.png" alt="GreenFeast" className="w-10 h-10 object-contain opacity-80" />
        </div>
      </header>

      <div className="px-6 pb-24 space-y-6">
        {/* Today's delivery */}
        <div className="glass grain rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <span className="font-sans text-[10px] uppercase tracking-widest text-slate">Today's arrival</span>
            <span className={`font-sans text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-4 px-5 pb-5">
            {todayMeal && (
              <img src={todayMeal.imageUrl} alt={todayMeal.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            )}
            <div>
              <p className="font-serif text-xl text-ink leading-tight">{todayMeal?.name ?? '—'}</p>
              <p className="font-sans text-xs text-slate mt-1">{user.address?.timeWindow ?? 'Before 1:00 PM'}</p>
              <p className="font-sans text-xs text-slate/60 italic mt-0.5">Nami batch</p>
            </div>
          </div>
        </div>

        {/* The week ahead */}
        <div>
          <p className="font-sans text-[10px] uppercase tracking-widest text-slate mb-3">The week ahead</p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {days.map((day, i) => {
              const mealId = weeklyPlan[day];
              const meal = mealId ? getMeal(mealId) : null;
              const isToday = day === today;
              const isPast = i < days.indexOf(today);
              return (
                <motion.button
                  key={day}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSwapDay(day)}
                  className={`flex-shrink-0 w-[88px] rounded-2xl overflow-hidden border transition-all ${
                    isToday ? 'border-goldenrod shadow-sm' : 'border-bone'
                  } ${isPast ? 'opacity-40' : ''} glass`}
                >
                  <p className="font-sans text-[9px] uppercase tracking-widest text-slate text-center pt-2">{day}</p>
                  {meal ? (
                    <img src={meal.imageUrl} alt={meal.name} className="w-full h-14 object-cover mt-1" />
                  ) : (
                    <div className="w-full h-14 bg-bone/40 mt-1" />
                  )}
                  <p className="font-sans text-[9px] text-slate/80 text-center px-1.5 py-1.5 leading-tight truncate">
                    {meal?.name.split(' ').slice(0, 2).join(' ') ?? '—'}
                  </p>
                </motion.button>
              );
            })}
          </div>
          <p className="font-sans text-[10px] text-slate/60 italic mt-2">Tap to swap · Curate by 8 PM tonight</p>
        </div>

        {/* Quick actions */}
        <div>
          <p className="font-sans text-[10px] uppercase tracking-widest text-slate mb-3">Actions</p>
          <div className="flex gap-2">
            {[
              { label: 'Skip tomorrow', Icon: SkipForward },
              { label: 'Pause', Icon: PauseCircle },
              { label: 'Add enhancement', Icon: PlusCircle },
            ].map(({ label, Icon }) => (
              <motion.button
                key={label}
                whileTap={{ scale: 0.97 }}
                className="flex-1 flex flex-col items-center gap-2 glass grain rounded-2xl py-4 px-2 min-h-[76px] active:bg-bone/30 transition-colors"
              >
                <Icon size={18} strokeWidth={1.5} className="text-pine" />
                <span className="font-sans text-[10px] text-slate text-center leading-tight">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Deliveries remaining */}
        <div className="glass grain rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-sans text-[10px] uppercase tracking-widest text-slate">Deliveries remaining</p>
            <p className="font-serif text-lg text-pine">{user.deliveriesRemaining}<span className="font-sans text-xs text-slate">/{user.plan?.mealsTotal}</span></p>
          </div>
          <div className="h-px bg-bone overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-pine rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((user.deliveriesRemaining ?? 0) / (user.plan?.mealsTotal ?? 1)) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <BottomNav />

      {/* Meal swap sheet */}
      <AnimatePresence>
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
                <button onClick={() => setSwapDay(null)} className="p-1"><X size={18} className="text-cream/50" /></button>
              </div>
              <div className="overflow-y-auto flex-1 p-5 space-y-2">
                {MEALS.filter(m => m.category !== 'smoothie').map(meal => (
                  <button
                    key={meal.id}
                    onClick={() => handleSwap(swapDay, meal.id)}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-colors ${
                      weeklyPlan[swapDay] === meal.id ? 'border-goldenrod/50 bg-cream/10' : 'border-cream/10 hover:bg-cream/5'
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
      </AnimatePresence>
    </motion.div>
  );
}

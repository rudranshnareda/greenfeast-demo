import { useState } from 'react';
import { MapPin, SkipForward, PauseCircle, PlusCircle, X } from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import { MEALS } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';

function getStatus(): { label: string; emoji: string; color: string } {
  const h = new Date().getHours();
  if (h < 11) return { label: 'Preparing', emoji: '🍳', color: 'bg-[#FFF59D] text-[#5D4037]' };
  if (h < 14) return { label: 'Out for delivery', emoji: '🚴', color: 'bg-blue-100 text-blue-700' };
  return { label: 'Delivered', emoji: '✅', color: 'bg-[#E8F5E9] text-[#1B5E20]' };
}

export default function Home() {
  const user = getUserFromStorage()!;
  const status = getStatus();

  const days = user.selectedDays?.length
    ? user.selectedDays
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);

  const getMeal = (id: string) => MEALS.find(m => m.id === id);

  const [swapDay, setSwapDay] = useState<string | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState(user.weeklyMealPlan ?? {});

  const todayMealId = weeklyPlan[today] ?? Object.values(weeklyPlan)[0];
  const todayMeal = todayMealId ? getMeal(todayMealId) : MEALS[0];

  const handleSwap = (day: string, mealId: string) => {
    const updated = { ...weeklyPlan, [day]: mealId };
    setWeeklyPlan(updated);
    saveUserToStorage({ weeklyMealPlan: updated });
    setSwapDay(null);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDF9E8]">
      {/* Header */}
      <header className="px-4 pt-10 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Hey {user.name} 👋
            </h1>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={13} className="text-[#1B5E20]" />
              <span className="text-sm text-[#6B7280]">{user.address?.city ?? 'Jaipur'}</span>
            </div>
          </div>
          <img src="/logo.png" alt="GreenFeast" className="w-10 h-10 object-contain" />
        </div>
      </header>

      <div className="px-4 pb-24 space-y-5">
        {/* Today's delivery */}
        <div className="bg-[#E8F5E9] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <p className="text-xs font-semibold text-[#1B5E20] uppercase tracking-wide">Today's delivery</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
              {status.emoji} {status.label}
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 pb-4">
            {todayMeal && (
              <img src={todayMeal.imageUrl} alt={todayMeal.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-[#1A1A1A] text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {todayMeal?.name ?? 'No meal today'}
              </p>
              <p className="text-xs text-[#6B7280] mt-0.5">{user.address?.timeWindow ?? 'Before 1:00 PM'}</p>
              <p className="text-xs text-[#6B7280]">Batch: Nami batch</p>
            </div>
          </div>
        </div>

        {/* This week */}
        <div>
          <p className="text-base font-semibold text-[#1A1A1A] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            This week
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {days.map((day, i) => {
              const mealId = weeklyPlan[day];
              const meal = mealId ? getMeal(mealId) : null;
              const isToday = day === today;
              const isPast = i < days.indexOf(today);
              return (
                <button
                  key={day}
                  onClick={() => setSwapDay(day)}
                  className={`flex-shrink-0 w-[90px] bg-white rounded-2xl overflow-hidden border-2 transition-all active:scale-95 ${
                    isToday ? 'border-[#FCD303] shadow-md' : 'border-transparent shadow-sm'
                  } ${isPast ? 'opacity-50' : ''}`}
                >
                  <p className="text-xs font-bold text-[#6B7280] text-center pt-2">{day}</p>
                  {meal ? (
                    <img src={meal.imageUrl} alt={meal.name} className="w-full h-14 object-cover mt-1" />
                  ) : (
                    <div className="w-full h-14 bg-[#F3F4F6] mt-1 flex items-center justify-center">
                      <span className="text-xs text-[#9CA3AF]">—</span>
                    </div>
                  )}
                  <p className="text-[10px] text-[#6B7280] text-center px-1 py-1 truncate">
                    {meal?.name.split(' ').slice(0, 2).join(' ') ?? '—'}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-[#9CA3AF] mt-2">Tap a day to swap your meal · Edit by 8 PM tonight</p>
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-base font-semibold text-[#1A1A1A] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Quick actions
          </p>
          <div className="flex gap-2">
            {[
              { label: 'Skip tomorrow', Icon: SkipForward },
              { label: 'Pause', Icon: PauseCircle },
              { label: 'Add-on', Icon: PlusCircle },
            ].map(({ label, Icon }) => (
              <button
                key={label}
                className="flex-1 flex flex-col items-center gap-1.5 bg-white rounded-2xl py-4 px-2 shadow-sm active:bg-[#E8F5E9] transition-colors min-h-[72px]"
              >
                <Icon size={20} className="text-[#1B5E20]" />
                <span className="text-xs text-[#6B7280] text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Deliveries remaining */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Deliveries remaining
            </p>
            <span className="text-sm font-bold text-[#1B5E20]">
              {user.deliveriesRemaining}/{user.plan?.mealsTotal ?? 0}
            </span>
          </div>
          <div className="h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1B5E20] rounded-full transition-all duration-500"
              style={{ width: `${((user.deliveriesRemaining ?? 0) / (user.plan?.mealsTotal ?? 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <BottomNav />

      {/* Meal swap sheet */}
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
              {MEALS.filter(m => m.category !== 'smoothie').map(meal => (
                <button
                  key={meal.id}
                  onClick={() => handleSwap(swapDay, meal.id)}
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

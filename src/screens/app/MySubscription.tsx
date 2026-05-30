import { useState } from 'react';
import { MapPin, SkipForward, PauseCircle, PlusCircle, X, ClipboardList, Wallet, Edit2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import { MEALS, DAYS_OF_WEEK } from '../../data/menu';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';

function getGreeting(name: string) {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name}.`;
  if (h < 17) return `Good afternoon, ${name}.`;
  return `Good evening, ${name}.`;
}

function getStatus(): { label: string; color: string } {
  const h = new Date().getHours();
  if (h < 11) return { label: 'In our kitchen', color: 'text-[#B45309] bg-[#FEF3C7]' };
  if (h < 14) return { label: 'On its way', color: 'text-[#1B5E20] bg-[#E8F5E9]' };
  return { label: 'Delivered', color: 'text-[#1B5E20] bg-[#E8F5E9]' };
}

function SubscribeGate() {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6">
      {/* Blurred backdrop — the MySubscription content renders behind this */}
      <div className="absolute inset-0 backdrop-blur-md bg-[#FDF9E8]/60" />
      <motion.div
        className="relative bg-white rounded-3xl p-8 w-full max-w-xs text-center shadow-2xl border border-[#E5E7EB]"
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🌿</span>
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Start your plan
        </h2>
        <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
          Subscribe to unlock daily fresh meals, your weekly schedule, wallet, and more.
        </p>
        <button
          onClick={() => navigate('/personal-info')}
          className="w-full bg-[#1B5E20] text-white font-bold text-sm py-3.5 rounded-full min-h-[48px]"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Subscribe now →
        </button>
        <button
          onClick={() => navigate('/menu')}
          className="mt-3 w-full text-sm text-[#6B7280] py-2"
        >
          Explore menu first
        </button>
      </motion.div>
    </div>
  );
}

export default function MySubscription() {
  const navigate = useNavigate();
  const user = getUserFromStorage()!;
  const isSubscriber = !!(user?.plan);
  const status = getStatus();

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);
  const mode = user.deliveryMode ?? 'opt-out';

  // selectedDays = days that have delivery active this week
  const [activeDays, setActiveDays] = useState<string[]>(
    user.selectedDays?.length ? user.selectedDays : (mode === 'opt-out' ? [...DAYS_OF_WEEK] : [])
  );
  const getMeal = (id: string) => MEALS.find(m => m.id === id);
  const [weeklyPlan, setWeeklyPlan] = useState(user.weeklyMealPlan ?? {});
  const [swapDay, setSwapDay] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    const updated = activeDays.includes(day)
      ? activeDays.filter(d => d !== day)
      : [...activeDays, day];
    setActiveDays(updated);
    saveUserToStorage({ selectedDays: updated });
  };

  const todayActive = activeDays.includes(today);
  const todayMealId = weeklyPlan[today] ?? Object.values(weeklyPlan)[0];
  const todayMeal = todayMealId ? getMeal(todayMealId) : MEALS[0];

  const handleSwap = (day: string, mealId: string) => {
    const updated = { ...weeklyPlan, [day]: mealId };
    setWeeklyPlan(updated);
    saveUserToStorage({ weeklyMealPlan: updated });
    setSwapDay(null);
  };

  return (
    <>
    {!isSubscriber && <SubscribeGate />}
    <motion.div
      className="max-w-md mx-auto min-h-screen bg-[#FDF9E8]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <header className="px-4 pt-10 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {getGreeting(user.name)}
            </h1>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-[#9CA3AF]" />
              <span className="text-xs text-[#9CA3AF] uppercase tracking-wide">{user.address?.city ?? 'Jaipur'}</span>
            </div>
          </div>
          <img src="/logo.png" alt="GreenFeast" className="w-9 h-9 object-contain opacity-80" />
        </div>
      </header>

      <div className="px-4 pb-24 space-y-5">

        {/* Today's delivery */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">Today's arrival</span>
            <span className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 pb-4">
            {todayActive && todayMeal ? (
              <>
                <img src={todayMeal.imageUrl} alt={todayMeal.name} className="w-[72px] h-[72px] rounded-xl object-cover flex-shrink-0" />
                <div>
                  <p className="font-bold text-base text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>{todayMeal.name}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{user.address?.timeWindow ?? 'Before 1:00 PM'}</p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-[72px] h-[72px] rounded-xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🚫</span>
                </div>
                <div>
                  <p className="font-bold text-base text-[#9CA3AF]" style={{ fontFamily: 'Poppins, sans-serif' }}>No delivery today</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">You've skipped today</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* The week ahead */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">This week</p>
            <p className="text-[10px] text-[#9CA3AF]">
              {mode === 'opt-out' ? 'Tap to skip a day' : 'Tap to add a day'}
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {DAYS_OF_WEEK.map((day, i) => {
              const isActive = activeDays.includes(day);
              const mealId = weeklyPlan[day];
              const meal = mealId ? getMeal(mealId) : null;
              const isToday = day === today;
              const todayIndex = DAYS_OF_WEEK.indexOf(today);
              const isPast = todayIndex >= 0 && i < todayIndex;
              return (
                <div key={day} className="flex-shrink-0 w-[84px] flex flex-col gap-1">
                  {/* Toggle button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleDay(day)}
                    disabled={isPast}
                    className={`w-full rounded-2xl overflow-hidden border-2 transition-all ${
                      isPast ? 'opacity-30 cursor-not-allowed' :
                      isToday ? 'border-[#FCD303]' :
                      isActive ? 'border-[#1B5E20]/30' : 'border-dashed border-[#D1D5DB]'
                    } ${isActive ? 'bg-white' : 'bg-[#F9FAFB]'}`}
                  >
                    <div className="flex items-center justify-between px-2 pt-2">
                      <p className={`text-[9px] font-semibold uppercase tracking-widest ${isToday ? 'text-[#1B5E20]' : 'text-[#9CA3AF]'}`}>{day}</p>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-[#1B5E20]' : 'bg-[#E5E7EB]'
                      }`}>
                        {isActive
                          ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                          : <Plus size={8} className="text-[#9CA3AF]" />
                        }
                      </div>
                    </div>
                    {isActive && meal ? (
                      <img src={meal.imageUrl} alt={meal.name} className="w-full h-14 object-cover mt-1" />
                    ) : (
                      <div className={`w-full h-14 mt-1 flex items-center justify-center ${isActive ? 'bg-[#F3F4F6]' : 'bg-transparent'}`}>
                        {!isActive && <p className="text-[8px] text-[#D1D5DB] text-center px-1">No delivery</p>}
                      </div>
                    )}
                    <p className={`text-[9px] text-center px-1.5 py-1.5 leading-tight truncate ${isActive ? 'text-[#9CA3AF]' : 'text-[#D1D5DB]'}`}>
                      {isActive ? (meal?.name.split(' ').slice(0, 2).join(' ') ?? '—') : ''}
                    </p>
                  </motion.button>
                  {/* Swap meal button — only for active days */}
                  {isActive && !isPast && (
                    <button
                      onClick={() => setSwapDay(day)}
                      className="w-full text-[8px] text-[#1B5E20] font-semibold text-center py-1 bg-[#E8F5E9] rounded-lg"
                    >
                      swap
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-[#9CA3AF] italic mt-1.5">Changes lock at 8 PM the night before</p>
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-2">Actions</p>
          <div className="flex gap-2">
            {[
              { label: 'Skip tomorrow', Icon: SkipForward },
              { label: 'Pause', Icon: PauseCircle },
              { label: 'Add enhancement', Icon: PlusCircle },
            ].map(({ label, Icon }) => (
              <motion.button
                key={label}
                whileTap={{ scale: 0.97 }}
                className="flex-1 flex flex-col items-center gap-2 bg-white rounded-2xl border border-[#E5E7EB] py-4 px-2 min-h-[76px]"
              >
                <Icon size={18} strokeWidth={1.5} className="text-[#1B5E20]" />
                <span className="text-[10px] text-[#6B7280] text-center leading-tight">{label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Deliveries remaining */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">Deliveries remaining</p>
            <p className="text-base font-bold text-[#1B5E20]">
              {user.deliveriesRemaining}<span className="text-xs font-normal text-[#9CA3AF]">/{user.plan?.mealsTotal}</span>
            </p>
          </div>
          <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#1B5E20] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((user.deliveriesRemaining ?? 0) / (user.plan?.mealsTotal ?? 1)) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Wallet */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={16} className="text-[#1B5E20]" />
            <p className="text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>Wallet</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-[#1A1A1A]">₹{user.wallet ?? 0}</p>
              <p className="text-xs text-[#9CA3AF]">Available balance</p>
            </div>
            <button className="bg-[#1B5E20] text-white text-sm font-semibold px-4 py-2 rounded-full min-h-[40px]">
              Add money
            </button>
          </div>
          <button className="mt-3 text-sm text-[#1B5E20] font-medium">View transactions</button>
          <div className="mt-2 bg-[#F9FAFB] rounded-xl px-3 py-2">
            <p className="text-xs text-[#9CA3AF] text-center">No transactions yet</p>
          </div>
        </div>

        {/* Delivery address */}
        {user.address && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>Delivery address</p>
              <button className="text-[#1B5E20] text-sm font-medium flex items-center gap-1">
                <Edit2 size={14} /> Edit
              </button>
            </div>
            <p className="text-sm text-[#1A1A1A]">{user.address.label} — {user.address.line1}</p>
            <p className="text-sm text-[#6B7280]">{user.address.city} {user.address.pincode}</p>
            {user.address.landmark && <p className="text-xs text-[#9CA3AF] mt-0.5">Near {user.address.landmark}</p>}
          </div>
        )}

        {/* Plan details button */}
        <button
          onClick={() => navigate('/plan-details')}
          className="w-full flex items-center gap-3 bg-white rounded-2xl border border-[#E5E7EB] px-4 py-4 min-h-[56px] active:bg-[#F9FAFB] transition-colors"
        >
          <ClipboardList size={18} strokeWidth={1.5} className="text-[#1B5E20]" />
          <span className="flex-1 text-left text-sm font-medium text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            View plan & settings
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#D1D5DB]">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
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
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              className="relative bg-[#1A2E1A] rounded-t-3xl max-h-[75vh] flex flex-col"
              initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              transition={{ duration: 0.25 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h2 className="font-bold text-lg text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{swapDay}</h2>
                <button onClick={() => setSwapDay(null)} className="p-1"><X size={18} className="text-white/50" /></button>
              </div>
              <div className="overflow-y-auto flex-1 p-4 space-y-2">
                {MEALS.filter(m => m.category !== 'smoothie').map(meal => (
                  <button
                    key={meal.id}
                    onClick={() => handleSwap(swapDay, meal.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                      weeklyPlan[swapDay] === meal.id ? 'border-[#FCD303]/60 bg-white/10' : 'border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <img src={meal.imageUrl} alt={meal.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-semibold text-sm text-white">{meal.name}</p>
                      <p className="text-[10px] text-white/50 uppercase tracking-wide">{meal.kcal} kcal · ₹{meal.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
}

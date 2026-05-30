import { useState } from 'react';
import { Pause, SkipForward, ArrowUpDown, X, Edit2 } from 'lucide-react'; // Edit2 kept for dietary card
import BottomNav from '../../components/BottomNav';
import { getUserFromStorage } from '../../lib/storage';
import { ADD_ONS } from '../../data/menu';

export default function Subscription() {
  const user = getUserFromStorage()!;
  const plan = user.plan!;

  const nextRenewal = (() => {
    const d = new Date(user.subscriptionStartDate ?? Date.now());
    d.setDate(d.getDate() + 30);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  })();

  const activeAddOns = (user.addOns ?? []).filter(a => a.selected).map(a => ADD_ONS.find(d => d.id === a.id));

  const [cancelModal, setCancelModal] = useState(false);
  const [editDietary, setEditDietary] = useState(false);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDF9E8]">
      <header className="px-4 pt-10 pb-4">
        <h1 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          My Subscription
        </h1>
      </header>

      <div className="px-4 pb-24 space-y-4">
        {/* Plan card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-[#1B5E20] px-4 py-4">
            <div className="flex items-center justify-between">
              <p className="text-white font-bold text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {plan.name}
              </p>
              <span className="bg-[#FCD303] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full">Active</span>
            </div>
            <p className="text-[#A5D6A7] text-sm mt-1">
              {plan.mealsTotal} meals · {plan.daysPerWeek} days/week · ₹{plan.basePrice.toLocaleString()}
            </p>
          </div>
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Next renewal</span>
              <span className="font-medium text-[#1A1A1A]">{nextRenewal}</span>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-[#6B7280]">Deliveries remaining</span>
                <span className="font-bold text-[#1B5E20]">{user.deliveriesRemaining}/{plan.mealsTotal}</span>
              </div>
              <div className="h-2.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1B5E20] rounded-full"
                  style={{ width: `${((user.deliveriesRemaining ?? 0) / plan.mealsTotal) * 100}%` }}
                />
              </div>
            </div>
            {activeAddOns.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {activeAddOns.map(a => a && (
                  <span key={a.id} className="bg-[#E8F5E9] text-[#1B5E20] text-xs font-semibold px-3 py-1 rounded-full">
                    {a.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-[#F3F4F6]">
          {[
            { label: 'Pause subscription', Icon: Pause, color: 'text-[#1A1A1A]' },
            { label: 'Skip a specific day', Icon: SkipForward, color: 'text-[#1A1A1A]' },
            { label: 'Change plan', Icon: ArrowUpDown, color: 'text-[#1A1A1A]' },
          ].map(({ label, Icon, color }) => (
            <button key={label} className="flex items-center gap-3 w-full px-4 py-4 min-h-[56px] active:bg-[#F9FAFB]">
              <Icon size={18} className={color} />
              <span className="text-sm text-[#1A1A1A] flex-1 text-left">{label}</span>
              <X size={14} className="text-[#9CA3AF] rotate-0" style={{ transform: 'rotate(45deg)' }} />
            </button>
          ))}
          <button
            onClick={() => setCancelModal(true)}
            className="flex items-center gap-3 w-full px-4 py-4 min-h-[56px] active:bg-red-50"
          >
            <X size={18} className="text-red-500" />
            <span className="text-sm text-red-500 flex-1 text-left">Cancel subscription</span>
          </button>
        </div>

        {/* Dietary profile card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Dietary Profile
            </p>
            <button
              onClick={() => setEditDietary(!editDietary)}
              className="text-[#1B5E20] text-sm font-medium flex items-center gap-1"
            >
              <Edit2 size={14} /> Edit
            </button>
          </div>
          {user.dietary?.allergens?.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {user.dietary.allergens.map(a => (
                <span key={a.name} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  a.severity === 'severe' ? 'bg-red-100 text-red-700' : 'bg-[#FFF59D] text-[#5D4037]'
                }`}>
                  {a.name} ({a.severity})
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#9CA3AF]">No allergens set</p>
          )}
          {user.dietary?.freeText && (
            <p className="text-xs text-[#6B7280] mt-2 italic">"{user.dietary.freeText}"</p>
          )}
        </div>

      </div>

      <BottomNav />

      {/* Cancel confirmation */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Cancel subscription?
            </h2>
            <p className="text-sm text-[#6B7280] mb-5">
              You have {user.deliveriesRemaining} deliveries remaining. Cancelling will stop future renewals.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal(false)}
                className="flex-1 py-3 rounded-full bg-[#E8F5E9] text-[#1B5E20] font-semibold text-sm min-h-[44px]"
              >
                Keep it
              </button>
              <button
                onClick={() => setCancelModal(false)}
                className="flex-1 py-3 rounded-full bg-red-500 text-white font-semibold text-sm min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

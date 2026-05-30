import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { ADD_ONS } from '../../data/menu';
import { getUserFromStorage } from '../../lib/storage';

export default function PaymentSummary() {
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const plan = user?.plan;
  const address = user?.address;

  if (!plan || !address) return null;

  const mealCount = plan.mealsTotal;
  const addOnsTotal = (user?.addOns ?? []).reduce((sum, ao) => {
    if (!ao.selected) return sum;
    const def = ADD_ONS.find(a => a.id === ao.id);
    return sum + (def ? def.pricePerMeal * mealCount : 0);
  }, 0);
  const total = plan.basePrice + addOnsTotal;

  const activeAddOns = (user?.addOns ?? []).filter(a => a.selected).map(ao => {
    const def = ADD_ONS.find(a => a.id === ao.id);
    return def ? { name: def.name, price: def.pricePerMeal * mealCount } : null;
  }).filter(Boolean);

  return (
    <Layout title="Review your order" showBack>
      <div className="space-y-4 pb-32">

        {/* Plan card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="bg-[#1B5E20] px-4 py-3">
            <p className="text-white font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {plan.name}
            </p>
            <p className="text-[#A5D6A7] text-xs mt-0.5">
              {user?.selectedDays?.join(', ') ?? 'Mon–Fri'}
            </p>
          </div>
          <div className="px-4 py-3 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Meal plan</span>
              <span className="font-medium text-[#1A1A1A]">₹{plan.basePrice.toLocaleString()}</span>
            </div>
            {activeAddOns.map(ao => ao && (
              <div key={ao.name} className="flex justify-between text-sm">
                <span className="text-[#6B7280]">{ao.name}</span>
                <span className="font-medium text-[#1A1A1A]">₹{ao.price}</span>
              </div>
            ))}
            <div className="border-t border-[#E5E7EB] pt-2.5 flex justify-between">
              <span className="font-bold text-[#1A1A1A]">Total</span>
              <span className="font-bold text-[#1B5E20] text-lg">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] px-4 py-4 space-y-1.5">
          <p className="text-xs font-semibold text-[#1B5E20] uppercase tracking-wide mb-2">Delivery</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{address.label} — {address.line1}</p>
          <p className="text-sm text-[#6B7280]">{address.city}, {address.pincode}</p>
          {address.landmark && <p className="text-xs text-[#9CA3AF]">Near {address.landmark}</p>}
        </div>

        {/* Dietary */}
        {(user?.dietaryPreference || (user?.dietary?.allergens?.length ?? 0) > 0) && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] px-4 py-4">
            <p className="text-xs font-semibold text-[#1B5E20] uppercase tracking-wide mb-2">Dietary</p>
            {user?.dietaryPreference && (
              <p className="text-sm text-[#1A1A1A] capitalize">{user.dietaryPreference.replace('-', ' ')}</p>
            )}
            {(user?.dietary?.allergens?.length ?? 0) > 0 && (
              <p className="text-xs text-[#6B7280] mt-1">
                Avoiding: {user!.dietary.allergens.map(a => a.name).join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Total banner */}
        <div className="bg-[#1B5E20] rounded-2xl px-4 py-4">
          <p className="text-white/70 text-sm">Total for first cycle</p>
          <p className="text-white text-2xl font-bold mt-0.5" style={{ fontFamily: 'Poppins, sans-serif' }}>
            ₹{total.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FDF9E8] to-transparent">
        <Button onClick={() => navigate('/payment')} fullWidth>
          Proceed to payment →
        </Button>
      </div>
    </Layout>
  );
}

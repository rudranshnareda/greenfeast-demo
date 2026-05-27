import type { Meal } from '../types';

interface MealCardProps {
  meal: Meal;
  onClick?: () => void;
  compact?: boolean;
}

export default function MealCard({ meal, onClick, compact = false }: MealCardProps) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left bg-white rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-transform duration-150 flex items-center gap-3 p-3"
      >
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[#1A1A1A] truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {meal.name}
          </p>
          <p className="text-xs text-[#6B7280] mt-0.5">{meal.kcal} kcal · {meal.protein}g protein</p>
          <p className="text-sm font-semibold text-[#1B5E20] mt-0.5">₹{meal.price}</p>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-transform duration-150"
    >
      <div className="relative">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full h-40 object-cover"
        />
        {meal.tags && meal.tags.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1">
            {meal.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-[#FCD303] text-[#1A1A1A] font-semibold px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-sm text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {meal.name}
        </p>
        <p className="text-xs text-[#6B7280] mt-1">{meal.kcal} kcal · {meal.protein}g protein</p>
        <p className="text-base font-bold text-[#1B5E20] mt-1">₹{meal.price}</p>
      </div>
    </button>
  );
}

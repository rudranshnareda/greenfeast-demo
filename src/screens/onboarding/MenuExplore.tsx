import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import MealCard from '../../components/MealCard';
import Button from '../../components/Button';
import { MEALS } from '../../data/menu';
import type { Meal, MealCategory } from '../../types';

const CATEGORIES: { id: MealCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'bowl', label: 'Power Bowls' },
  { id: 'wrap', label: 'Wraps & Panini' },
  { id: 'salad', label: 'Salads' },
  { id: 'toast', label: 'Toasts' },
  { id: 'smoothie', label: 'Smoothies' },
];

interface MealSheetProps {
  meal: Meal;
  onClose: () => void;
}

function MealSheet({ meal, onClose }: MealSheetProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <img src={meal.imageUrl} alt={meal.name} className="w-full h-52 object-cover rounded-t-3xl" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-white/90 rounded-full p-2 min-w-[36px] min-h-[36px] flex items-center justify-center"
        >
          <X size={18} />
        </button>
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {meal.name}
            </h2>
            <span className="text-lg font-bold text-[#1B5E20] whitespace-nowrap">₹{meal.price}</span>
          </div>
          <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">{meal.description}</p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: 'Calories', val: `${meal.kcal}` },
              { label: 'Protein', val: `${meal.protein}g` },
              { label: 'Carbs', val: `${meal.carbs}g` },
              { label: 'Fat', val: `${meal.fat}g` },
            ].map(({ label, val }) => (
              <div key={label} className="bg-[#E8F5E9] rounded-xl p-2 text-center">
                <p className="text-base font-bold text-[#1B5E20]">{val}</p>
                <p className="text-[10px] text-[#6B7280]">{label}</p>
              </div>
            ))}
          </div>
          {meal.tags && meal.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {meal.tags.map(tag => (
                <span key={tag} className="bg-[#FCD303] text-[#1A1A1A] text-xs font-semibold px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MenuExploreProps {
  browseOnly?: boolean;
}

export default function MenuExplore({ browseOnly = false }: MenuExploreProps) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<MealCategory | 'all'>('all');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const filtered = activeCategory === 'all' ? MEALS : MEALS.filter(m => m.category === activeCategory);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDF9E8] flex flex-col">
      <header className="flex items-center gap-3 px-4 py-3 bg-[#FDF9E8] sticky top-0 z-10 border-b border-[#E5E7EB]">
        <h1 className="text-lg font-semibold text-[#1A1A1A] flex-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {browseOnly ? 'Menu' : 'Explore our menu'}
        </h1>
      </header>

      {/* Category tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide sticky top-[57px] bg-[#FDF9E8] z-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 min-h-[36px] flex-shrink-0 ${
              activeCategory === cat.id
                ? 'bg-[#1B5E20] text-white'
                : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Meal grid */}
      <div className="flex-1 px-4 pb-32">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(meal => (
            <MealCard key={meal.id} meal={meal} onClick={() => setSelectedMeal(meal)} />
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      {!browseOnly && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FDF9E8] to-transparent">
          <Button onClick={() => navigate('/subscription-options')} fullWidth>
            Continue →
          </Button>
        </div>
      )}

      {/* Meal detail sheet */}
      {selectedMeal && (
        <MealSheet
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </div>
  );
}

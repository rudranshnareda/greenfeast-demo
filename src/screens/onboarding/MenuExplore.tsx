import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import MealCard from '../../components/MealCard';
import Button from '../../components/Button';
import { MEALS } from '../../data/menu';
import type { Meal, MealCategory } from '../../types';

const CATEGORIES: { id: MealCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'bowl', label: 'Bowls' },
  { id: 'wrap', label: 'Wraps' },
  { id: 'salad', label: 'Salads' },
  { id: 'toast', label: 'Toasts' },
  { id: 'smoothie', label: 'Sips' },
];

function MealSheet({ meal, onClose }: { meal: Meal; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
      <motion.div
        className="relative glass-dark grain rounded-t-3xl max-h-[85vh] overflow-y-auto"
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
      >
        <img src={meal.imageUrl} alt={meal.name} className="w-full h-56 object-cover rounded-t-3xl" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-cream/10 backdrop-blur-sm rounded-full p-2 min-w-[36px] min-h-[36px] flex items-center justify-center"
        >
          <X size={16} className="text-cream" />
        </button>
        <div className="p-6">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="font-serif text-2xl text-cream leading-tight">{meal.name}</h2>
            <span className="font-serif text-xl text-goldenrod-light whitespace-nowrap">₹{meal.price}</span>
          </div>
          <p className="font-sans font-light text-sm text-cream/70 leading-relaxed italic mb-5">
            {meal.description}
          </p>
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { label: 'Cal', val: `${meal.kcal}` },
              { label: 'Protein', val: `${meal.protein}g` },
              { label: 'Carbs', val: `${meal.carbs}g` },
              { label: 'Fat', val: `${meal.fat}g` },
            ].map(({ label, val }) => (
              <div key={label} className="bg-cream/10 rounded-xl p-3 text-center">
                <p className="font-serif text-lg text-cream">{val}</p>
                <p className="font-sans text-[9px] text-cream/60 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
          {meal.tags && meal.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {meal.tags.map(tag => (
                <span key={tag} className="font-sans text-[10px] uppercase tracking-widest border border-goldenrod/40 text-goldenrod-light px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
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
    <motion.div
      className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-cream via-cream to-bone/40 flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header */}
      <header className="px-6 pt-8 pb-2 sticky top-0 z-10 bg-cream/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {!browseOnly && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl min-w-[44px] min-h-[44px] flex items-center justify-center active:bg-bone/60"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-pine">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="font-serif text-3xl text-ink">The Menu</h1>
            <p className="font-sans text-xs text-slate uppercase tracking-widest mt-0.5">
              Crafted weekly. Considered daily.
            </p>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-sans text-xs uppercase tracking-widest transition-all duration-200 min-h-[36px] flex-shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-pine text-cream'
                  : 'text-slate border border-bone bg-cream/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* Meal grid */}
      <div className="flex-1 px-6 pb-32 mt-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(meal => (
            <MealCard key={meal.id} meal={meal} onClick={() => setSelectedMeal(meal)} />
          ))}
        </div>
      </div>

      {/* CTA */}
      {!browseOnly && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-6 pb-8 pt-4 bg-gradient-to-t from-cream to-transparent">
          <Button onClick={() => navigate('/plan')} fullWidth variant="accent">
            Compose your week →
          </Button>
        </div>
      )}

      {/* Detail sheet */}
      {selectedMeal && (
        <MealSheet meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      )}
    </motion.div>
  );
}

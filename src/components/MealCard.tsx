import type { Meal } from '../types';
import { motion } from 'framer-motion';

interface MealCardProps {
  meal: Meal;
  onClick?: () => void;
  compact?: boolean;
}

export default function MealCard({ meal, onClick, compact = false }: MealCardProps) {
  if (compact) {
    return (
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className="w-full text-left glass grain rounded-2xl overflow-hidden flex items-center gap-3 p-3"
      >
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-serif text-base text-ink truncate leading-tight">{meal.name}</p>
          <p className="font-sans text-[10px] text-slate uppercase tracking-widest mt-0.5">
            {meal.kcal} kcal · {meal.protein}g protein
          </p>
          <p className="font-serif text-sm text-pine mt-1">₹{meal.price}</p>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left rounded-2xl overflow-hidden shadow-sm"
    >
      <div className="relative">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="w-full aspect-[4/3] object-cover rounded-t-2xl"
        />
        {meal.tags && meal.tags.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1">
            {meal.tags.map(tag => (
              <span
                key={tag}
                className="font-sans text-[10px] uppercase tracking-widest bg-cream/90 text-pine px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="glass grain rounded-b-2xl p-4">
        <p className="font-serif text-xl text-ink leading-tight">{meal.name}</p>
        <p className="font-sans font-light text-sm text-charcoal/70 leading-relaxed mt-1 italic line-clamp-1">
          {meal.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <p className="font-serif text-lg text-pine">₹{meal.price}</p>
          <p className="font-sans text-[10px] text-slate uppercase tracking-widest">
            {meal.kcal} kcal · {meal.protein}g prot
          </p>
        </div>
      </div>
    </motion.button>
  );
}

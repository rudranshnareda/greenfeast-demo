import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import { getUserFromStorage } from '../../lib/storage';

function getGreeting(name: string) {
  const h = new Date().getHours();
  const first = name.split(' ')[0];
  if (h < 12) return `Good morning, ${first}.`;
  if (h < 17) return `Good afternoon, ${first}.`;
  return `Good evening, ${first}.`;
}

const STORY_CARDS = [
  {
    emoji: '🌿',
    headline: 'Made this morning.',
    body: "Every meal is prepared fresh in our Jaipur kitchen — no cold storage, no shortcuts. By the time it reaches you, it's been in the world for less than 4 hours.",
  },
  {
    emoji: '⚖️',
    headline: 'Nutrition, considered.',
    body: "We obsess over macro balance so you don't have to. Each bowl is crafted to fuel your goals — whether that's more energy, a leaner build, or simply eating cleaner.",
  },
  {
    emoji: '📅',
    headline: 'Consistency is the meal.',
    body: 'One great day of eating is luck. 20 days in a row is a habit. A GreenFeast subscription makes the healthy choice the effortless one — day after day.',
  },
  {
    emoji: '🫙',
    headline: 'Nothing hidden inside.',
    body: 'No preservatives. No artificial colour. No mystery ingredients. Real vegetables, real grains, real protein — tasted and tracked by people who care.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const hasSubscription = !!(user?.plan);

  return (
    <motion.div
      className="max-w-md mx-auto min-h-screen bg-[#FDF9E8]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#1B5E20] px-6 pt-14 pb-10">
        {/* subtle leaf pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #FCD303 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #FCD303 0%, transparent 40%)`,
        }} />

        <div className="relative">
          <img src="/logo.png" alt="GreenFeast" className="w-10 h-10 object-contain mb-5" />

          {user?.name && (
            <motion.p
              className="text-[#A5D6A7] text-sm font-medium mb-1"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {getGreeting(user.name)}
            </motion.p>
          )}

          <motion.h1
            className="text-white text-3xl font-bold leading-tight mb-4"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Nutrition,<br />considered.
          </motion.h1>

          <motion.p
            className="text-[#A5D6A7] text-sm leading-relaxed max-w-[280px]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            Fresh meals from our Jaipur kitchen to your door — every weekday, before 1 PM.
          </motion.p>

          {!hasSubscription && (
            <motion.button
              onClick={() => navigate('/personal-info')}
              whileTap={{ scale: 0.97 }}
              className="mt-6 flex items-center gap-2 bg-[#FCD303] text-[#1A1A1A] text-sm font-bold px-5 py-3 rounded-full min-h-[44px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
            >
              Build your plan <ArrowRight size={15} strokeWidth={2.5} />
            </motion.button>
          )}

          {hasSubscription && (
            <motion.button
              onClick={() => navigate('/subscription')}
              whileTap={{ scale: 0.97 }}
              className="mt-6 flex items-center gap-2 bg-[#FCD303] text-[#1A1A1A] text-sm font-bold px-5 py-3 rounded-full min-h-[44px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
            >
              My plan <ArrowRight size={15} strokeWidth={2.5} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Story strip */}
      <div className="px-4 pt-6 pb-2">
        <div className="flex items-center gap-1.5 mb-4">
          <Leaf size={13} className="text-[#1B5E20]" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">The GreenFeast way</p>
        </div>

        <div className="space-y-3">
          {STORY_CARDS.map((card, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <span className="text-2xl flex-shrink-0 mt-0.5">{card.emoji}</span>
              <div>
                <p className="font-bold text-sm text-[#1A1A1A] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {card.headline}
                </p>
                <p className="text-xs text-[#6B7280] leading-relaxed">{card.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Menu nudge */}
      <div className="px-4 pt-4 pb-28">
        <motion.button
          onClick={() => navigate('/menu')}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#1A2E1A] rounded-2xl px-5 py-5 flex items-center justify-between"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div>
            <p className="text-white font-bold text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Explore this week's menu</p>
            <p className="text-[#A5D6A7] text-xs mt-0.5">Power Bowls · Wraps · Salads · Smoothies</p>
          </div>
          <ArrowRight size={18} className="text-[#FCD303] flex-shrink-0" />
        </motion.button>
      </div>

      <BottomNav />
    </motion.div>
  );
}

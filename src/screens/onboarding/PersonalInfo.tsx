import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { getUserFromStorage, saveUserToStorage } from '../../lib/storage';

const GOALS = [
  { id: 'build-muscle', label: 'Build Muscle', emoji: '💪' },
  { id: 'weight-loss', label: 'Weight Loss', emoji: '🔥' },
  { id: 'eat-clean', label: 'Eat Clean', emoji: '🥗' },
];

export default function PersonalInfo() {
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const prev = user?.healthProfile;
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const [age, setAge] = useState(prev?.age ?? '');
  const [weight, setWeight] = useState(prev?.weight ?? '');
  const [height, setHeight] = useState(prev?.height ?? '');
  const [goal, setGoal] = useState(prev?.goal ?? '');

  const handleNext = () => {
    saveUserToStorage({ healthProfile: { age, weight, height, goal } });
    navigate('/dietary');
  };

  return (
    <Layout showBack>
      <div className="space-y-6 pb-32 pt-2">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Hey {firstName}! 👋
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">We'd like to know a bit more about you</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Age</label>
            <input
              type="number"
              inputMode="numeric"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="25"
              className="w-full bg-white border-2 border-[#E5E7EB] rounded-xl px-3 py-3 text-[#1A1A1A] text-sm text-center focus:outline-none focus:border-[#1B5E20] min-h-[52px] transition-colors"
            />
            <p className="text-[10px] text-[#9CA3AF] text-center mt-1">years</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Weight</label>
            <input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="65"
              className="w-full bg-white border-2 border-[#E5E7EB] rounded-xl px-3 py-3 text-[#1A1A1A] text-sm text-center focus:outline-none focus:border-[#1B5E20] min-h-[52px] transition-colors"
            />
            <p className="text-[10px] text-[#9CA3AF] text-center mt-1">kg</p>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Height</label>
            <input
              type="number"
              inputMode="decimal"
              value={height}
              onChange={e => setHeight(e.target.value)}
              placeholder="170"
              className="w-full bg-white border-2 border-[#E5E7EB] rounded-xl px-3 py-3 text-[#1A1A1A] text-sm text-center focus:outline-none focus:border-[#1B5E20] min-h-[52px] transition-colors"
            />
            <p className="text-[10px] text-[#9CA3AF] text-center mt-1">cm</p>
          </div>
        </div>

        {/* Health goal */}
        <div>
          <p className="text-sm font-semibold text-[#1A1A1A] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            What's your main goal?
          </p>
          <div className="space-y-2.5">
            {GOALS.map(g => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border-2 transition-all duration-150 min-h-[60px] ${
                  goal === g.id
                    ? 'border-[#1B5E20] bg-[#E8F5E9]'
                    : 'border-[#E5E7EB] bg-white'
                }`}
              >
                <span className="text-2xl">{g.emoji}</span>
                <span
                  className={`font-semibold text-sm flex-1 text-left ${goal === g.id ? 'text-[#1B5E20]' : 'text-[#1A1A1A]'}`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {g.label}
                </span>
                {goal === g.id && (
                  <div className="w-5 h-5 rounded-full bg-[#1B5E20] flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-[#FDF9E8] to-transparent">
        <Button onClick={handleNext} fullWidth disabled={!age || !weight || !height || !goal}>
          Continue →
        </Button>
      </div>
    </Layout>
  );
}

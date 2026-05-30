import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  'Analysing your health profile...',
  'Matching meals to your goal...',
  'Checking allergens & preferences...',
  'Building your plan...',
];

export default function AILoading() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Cycle through steps
    const stepInterval = setInterval(() => {
      setStepIndex(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 600);

    // Navigate after 2.8s
    const navTimer = setTimeout(() => {
      navigate('/meal-selection');
    }, 2800);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDF9E8] flex flex-col items-center justify-center px-6">
      <div className="text-center w-full">
        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-[#E8F5E9]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1B5E20] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🌿</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Creating your custom plan
        </h2>
        <p className="text-sm text-[#6B7280] leading-relaxed h-5 transition-all duration-300">
          {STEPS[stepIndex]}
        </p>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#1B5E20] animate-bounce"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

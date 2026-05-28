import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-sans font-medium text-sm tracking-wide transition-all duration-200 min-h-[52px] px-6 select-none';

  const variants = {
    primary: 'bg-pine text-cream hover:bg-pine-deep disabled:opacity-40',
    secondary: 'border border-pine/40 text-pine bg-transparent hover:bg-pine/5 disabled:opacity-40',
    accent: 'bg-goldenrod text-ink hover:bg-goldenrod-light disabled:opacity-40',
    danger: 'border border-red-400/50 text-red-500 bg-transparent hover:bg-red-50/50 disabled:opacity-40',
    ghost: 'bg-bone/60 text-pine hover:bg-bone disabled:opacity-40',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
}

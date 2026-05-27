import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
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
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold text-base transition-all duration-200 min-h-[44px] px-6 select-none';

  const variants = {
    primary: 'bg-[#1B5E20] text-white active:bg-[#0D3F12] disabled:opacity-40',
    secondary: 'bg-transparent border-2 border-[#1B5E20] text-[#1B5E20] active:bg-[#E8F5E9] disabled:opacity-40',
    danger: 'bg-transparent border-2 border-red-500 text-red-500 active:bg-red-50 disabled:opacity-40',
    ghost: 'bg-[#E8F5E9] text-[#1B5E20] active:bg-[#d0ebd0] disabled:opacity-40',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

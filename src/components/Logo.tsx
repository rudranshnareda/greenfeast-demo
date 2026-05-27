interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 64, className = '' }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="GreenFeast"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}

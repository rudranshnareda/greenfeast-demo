import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import { saveUserToStorage } from '../../lib/storage';

type Step = 'phone' | 'otp' | 'name';

export default function PhoneAuth() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleSendOtp = () => {
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setPhoneError('Enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError('');
    setStep('otp');
  };

  const handleVerify = () => {
    if (otp.length < 4 || otp.length > 6) {
      setOtpError('Enter the 4–6 digit OTP');
      return;
    }
    setOtpError('');
    setStep('name');
  };

  const handleContinue = () => {
    if (!name.trim()) return;
    saveUserToStorage({ phone, name, onboarded: false });
    navigate('/menu-explore');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDF9E8] flex flex-col px-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <Logo size={80} className="mb-4" />
        <h1
          className="text-2xl font-bold text-[#1B5E20] text-center mb-1"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          GreenFeast
        </h1>
        <p className="text-[#6B7280] text-sm text-center mb-10">
          Healthy eating, made effortless
        </p>

        {/* Phone step */}
        <div className="w-full space-y-3">
          <div className="flex gap-2">
            <span className="flex items-center justify-center bg-[#E8F5E9] text-[#1B5E20] font-semibold rounded-xl px-4 min-h-[52px] text-sm border border-[#1B5E20]/20 whitespace-nowrap">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setPhoneError(''); }}
              placeholder="Mobile number"
              disabled={step !== 'phone'}
              className="flex-1 bg-white border border-[#E5E7EB] rounded-xl px-4 min-h-[52px] text-base text-[#1A1A1A] placeholder-[#9CA3AF] outline-none focus:border-[#1B5E20] transition-colors disabled:opacity-60"
            />
          </div>
          {phoneError && <p className="text-red-500 text-xs">{phoneError}</p>}

          {step === 'phone' && (
            <Button onClick={handleSendOtp} fullWidth disabled={phone.length !== 10}>
              Send OTP
            </Button>
          )}
        </div>

        {/* OTP step */}
        {(step === 'otp' || step === 'name') && (
          <div className="w-full mt-4 space-y-3">
            <input
              type="tel"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
              placeholder="Enter OTP (any code)"
              disabled={step === 'name'}
              className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 min-h-[52px] text-base text-[#1A1A1A] placeholder-[#9CA3AF] outline-none focus:border-[#1B5E20] transition-colors tracking-widest disabled:opacity-60"
            />
            {otpError && <p className="text-red-500 text-xs">{otpError}</p>}
            {step === 'otp' && (
              <Button onClick={handleVerify} fullWidth disabled={otp.length < 4}>
                Verify OTP
              </Button>
            )}
          </div>
        )}

        {/* Name step */}
        {step === 'name' && (
          <div className="w-full mt-4 space-y-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
              className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 min-h-[52px] text-base text-[#1A1A1A] placeholder-[#9CA3AF] outline-none focus:border-[#1B5E20] transition-colors"
            />
            <Button onClick={handleContinue} fullWidth disabled={!name.trim()}>
              Continue →
            </Button>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-[#9CA3AF] pb-8">
        By continuing you agree to our Terms & Privacy Policy
      </p>
    </div>
  );
}

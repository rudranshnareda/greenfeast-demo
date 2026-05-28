import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import { saveUserToStorage } from '../../lib/storage';

type Step = 'phone' | 'otp' | 'name';

const INPUT = 'w-full bg-transparent border-b border-bone focus:border-pine outline-none py-3 font-sans text-charcoal placeholder:text-slate/50 text-base transition-colors';
const LABEL = 'font-sans text-xs uppercase tracking-widest text-charcoal/60 mb-2 block';

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
      setPhoneError('Please enter a valid 10-digit number');
      return;
    }
    setPhoneError('');
    setStep('otp');
  };

  const handleVerify = () => {
    if (otp.length < 4) {
      setOtpError('Enter the verification code');
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
    <motion.div
      className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-cream via-cream to-bone/40 flex flex-col px-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Logo block */}
        <Logo size={64} className="mb-4" />
        <h1 className="font-serif text-2xl text-pine tracking-wide">GreenFeast</h1>
        <div className="border-b border-goldenrod w-12 mx-auto mt-2" />
        <p className="font-serif italic text-sm text-charcoal/70 mt-3 mb-12">
          Nutrition, considered.
        </p>

        {/* Phone */}
        <div className="w-full space-y-6">
          <div>
            <label className={LABEL}>Begin with your number</label>
            <div className="flex items-end gap-3">
              <span className="font-sans text-sm text-slate pb-3 border-b border-bone whitespace-nowrap">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setPhoneError(''); }}
                placeholder="10-digit mobile"
                disabled={step !== 'phone'}
                className={`${INPUT} flex-1 disabled:opacity-50`}
              />
            </div>
            {phoneError && <p className="font-sans text-xs text-red-400 mt-1">{phoneError}</p>}
          </div>

          {step === 'phone' && (
            <Button onClick={handleSendOtp} fullWidth disabled={phone.length !== 10}>
              Continue
            </Button>
          )}
        </div>

        {/* OTP */}
        {(step === 'otp' || step === 'name') && (
          <motion.div
            className="w-full mt-8 space-y-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label className={LABEL}>Verify it's you</label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                placeholder="Verification code"
                disabled={step === 'name'}
                className={`${INPUT} tracking-[0.3em] disabled:opacity-50`}
              />
              {otpError && <p className="font-sans text-xs text-red-400 mt-1">{otpError}</p>}
            </div>
            {step === 'otp' && (
              <Button onClick={handleVerify} fullWidth disabled={otp.length < 4}>
                Verify
              </Button>
            )}
          </motion.div>
        )}

        {/* Name */}
        {step === 'name' && (
          <motion.div
            className="w-full mt-8 space-y-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label className={LABEL}>And your name?</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                autoFocus
                className={INPUT}
              />
            </div>
            <Button onClick={handleContinue} fullWidth disabled={!name.trim()}>
              Enter →
            </Button>
          </motion.div>
        )}
      </div>

      <p className="font-sans text-[10px] text-slate/60 text-center pb-10 uppercase tracking-widest">
        By continuing you agree to our terms
      </p>
    </motion.div>
  );
}

import { useState, useEffect } from 'react';
import { X, Phone, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginModal({ onClose }) {
  const { t } = useLanguage();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'success'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    // Setup recaptcha
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });
    }
  }, []);

  const handleSendOtp = async () => {
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const phoneNumber = `+91${phone}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send OTP. Please try again.');
      // Reset recaptcha on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
          grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setError('Enter the 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await confirmationResult.confirm(otp);
      setStep('success');
      setTimeout(onClose, 1200);
    } catch (err) {
      console.error(err);
      setError('Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up"
        style={{ background: '#0F2040', border: '1px solid rgba(201,168,76,0.3)' }}
      >
        <div id="recaptcha-container"></div>
        {/* Top accent line */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #C9A84C, #E8C76B, #C9A84C)' }} />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="px-8 py-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.3)' }}
            >
              {step === 'success'
                ? <Shield size={28} style={{ color: '#C9A84C' }} />
                : <Phone size={28} style={{ color: '#C9A84C' }} />
              }
            </div>
          </div>

          {step === 'success' ? (
            <div className="text-center">
              <h2 className="text-2xl font-display font-bold text-white mb-2">{t('login_success')}</h2>
              <p className="text-white/60 text-sm">Welcome back! Redirecting...</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-display font-bold text-white text-center mb-1">
                {t('login_title')}
              </h2>
              <p className="text-white/50 text-sm text-center mb-6">
                {t('login_subtitle')}
              </p>

              {step === 'phone' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                      {t('login_phone_label')}
                    </label>
                    <div className="flex">
                      <span
                        className="flex items-center px-3 rounded-l-xl text-sm font-medium text-white/70 border-r"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRight: 'none' }}
                      >
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder={t('login_phone_placeholder')}
                        className="flex-1 px-4 py-3 rounded-r-xl text-white text-sm outline-none transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.07)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderLeft: 'none',
                        }}
                        onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-xs">{error}</p>}

                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full btn-gold py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : t('login_send_otp')}
                  </button>
                </div>
              )}

              {step === 'otp' && (
                <div className="space-y-4">
                  <div
                    className="text-xs text-center py-2 px-3 rounded-lg"
                    style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C' }}
                  >
                    {t('login_otp_sent')}: +91 {phone}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                      {t('login_otp_label')}
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-3 rounded-xl text-white text-lg text-center tracking-[0.5em] font-bold outline-none"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        letterSpacing: '0.4em',
                      }}
                      onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                      maxLength={6}
                      autoFocus
                    />
                  </div>

                  {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length !== 6}
                    className="w-full btn-gold py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying...' : t('login_verify_otp')}
                  </button>

                  <button
                    onClick={() => { setStep('phone'); setOtp(''); setError(''); setConfirmationResult(null); }}
                    className="w-full py-2 text-xs text-white/40 hover:text-white/70 transition-colors"
                  >
                    ← Change number
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

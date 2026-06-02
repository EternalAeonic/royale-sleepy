import { useState, useEffect } from 'react';
import { X, Phone, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, signInAnonymously } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function LoginModal({ onClose }) {
  const { t } = useLanguage();
  const [step, setStep] = useState('phone'); // 'phone' | 'success' | 'complete_profile'
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const { savePhone, saveName, user } = useAuth();

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

  const handleSimpleLogin = async () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const result = await signInAnonymously(auth);
      const uid = result.user.uid;
      const phoneStr = `+91${phone}`;

      // Save name and phone to local storage using context
      if (savePhone) savePhone(phoneStr);
      if (saveName) saveName(name);

      // Save user to admin users list
      const users = JSON.parse(localStorage.getItem('royale_users') || '[]');
      const existing = users.findIndex(u => u.uid === uid);
      const userData = {
        uid,
        name: name.trim(),
        phone: phoneStr,
        email: '',
        loginMethod: 'Phone',
        loginAt: new Date().toISOString(),
      };
      if (existing >= 0) {
        users[existing] = { ...users[existing], ...userData };
      } else {
        users.push(userData);
      }
      localStorage.setItem('royale_users', JSON.stringify(users));

      setStep('success');
      setTimeout(onClose, 1200);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to login. Please try again.');
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Save user to admin users list
      const users = JSON.parse(localStorage.getItem('royale_users') || '[]');
      const existing = users.findIndex(u => u.uid === firebaseUser.uid);
      const savedPhone = localStorage.getItem(`phone_${firebaseUser.uid}`) || firebaseUser.phoneNumber || '';
      const userData = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || 'Google User',
        phone: savedPhone,
        email: firebaseUser.email || '',
        loginMethod: 'Google',
        loginAt: new Date().toISOString(),
      };
      if (existing >= 0) {
        users[existing] = { ...users[existing], ...userData };
      } else {
        users.push(userData);
      }
      localStorage.setItem('royale_users', JSON.stringify(users));

      // Check if user has phone number
      if (!firebaseUser.phoneNumber && !localStorage.getItem(`phone_${firebaseUser.uid}`)) {
        setStep('complete_profile');
      } else {
        setStep('success');
        setTimeout(onClose, 1200);
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('Error: This domain is not authorized in Firebase Console.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Login cancelled.');
      } else {
        setError(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSavePhoneProfile = () => {
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    
    savePhone(`+91${phone}`);
    setStep('success');
    setTimeout(onClose, 1200);
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
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                    />
                  </div>

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
                        onKeyDown={e => e.key === 'Enter' && handleSimpleLogin()}
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-xs">{error}</p>}

                  <button
                    onClick={handleSimpleLogin}
                    disabled={loading}
                    className="w-full btn-gold py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-white/40 text-xs uppercase tracking-widest">or</span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>

                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-white font-semibold text-sm transition-all border border-white/20 hover:bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
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

              {step === 'complete_profile' && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-white/80 text-sm">Almost there! We just need your phone number for delivery updates.</p>
                  </div>
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
                        onKeyDown={e => e.key === 'Enter' && handleSavePhoneProfile()}
                        maxLength={10}
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-xs">{error}</p>}

                  <button
                    onClick={handleSavePhoneProfile}
                    disabled={loading}
                    className="w-full btn-gold py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    Save & Continue
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

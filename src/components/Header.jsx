import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoginModal from './LoginModal';

export default function Header() {
  const { user, logout } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/',         label: t('nav_home') },
    { to: '/products', label: t('nav_products') },
    { to: '/about',    label: t('nav_about') },
    { to: '/contact',  label: t('nav_contact') },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-ivory/95 backdrop-blur-md border-b border-linen shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex flex-col leading-none group">
              <span className="font-display text-2xl font-semibold text-forest tracking-widest transition-all duration-300 group-hover:text-gold">
                ROYALE SLEEPY
              </span>
              <span className="font-body text-[0.55rem] tracking-[0.25em] text-stone/70 uppercase mt-0.5">
                Sree Sainath Enterprise
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative font-body text-sm tracking-wide transition-colors duration-300 group ${
                    location.pathname === link.to ? 'text-forest' : 'text-stone hover:text-bark'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-[1px] bg-gold transition-all duration-300 ${
                    location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 lg:gap-3">

              {/* Phone Quick Action */}
              <a
                href="tel:+918763600036"
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-gold/40 text-xs font-medium text-gold hover:bg-gold hover:text-ivory transition-all duration-300"
              >
                <Phone size={12} />
                <span>+91 87636 00036</span>
              </a>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-linen text-xs font-medium text-stone hover:border-gold hover:text-gold transition-all duration-300"
                title="Toggle Language"
              >
                <Globe size={12} />
                <span>{language === 'en' ? 'EN' : language === 'te' ? 'తె' : 'ଓଡ଼ିଆ'}</span>
              </button>

              {/* Login / User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(v => !v)}
                    className="hidden lg:flex items-center gap-2 px-3 py-1.5 border border-forest/30 text-forest text-xs font-medium hover:bg-forest hover:text-ivory transition-all duration-300"
                  >
                    {user.name}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-40 shadow-xl overflow-hidden z-50 bg-ivory border border-linen">
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-bark hover:bg-ivory-deep transition-colors"
                      >
                        {t('nav_logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="hidden lg:flex px-5 py-2 border border-forest/40 text-xs tracking-[0.2em] uppercase font-medium text-forest hover:bg-forest hover:text-ivory transition-all duration-300"
                >
                  {t('nav_login')}
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="lg:hidden p-2 text-bark hover:text-forest transition-colors"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-ivory border-t border-linen">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 text-sm font-light tracking-widest transition-colors ${
                    location.pathname === link.to
                      ? 'text-forest bg-ivory-deep'
                      : 'text-stone hover:bg-ivory-deep'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:+918763600036"
                className="flex items-center gap-2 px-4 py-3 text-sm text-gold font-light tracking-widest"
              >
                <Phone size={14} />
                +91 87636 00036
              </a>
              <div className="pt-2 border-t border-linen mt-2">
                {user ? (
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-sm font-light tracking-widest text-red-500 hover:bg-ivory-deep transition-colors"
                  >
                    {t('nav_logout')} ({user.name})
                  </button>
                ) : (
                  <button
                    onClick={() => { setShowLogin(true); setMenuOpen(false); }}
                    className="w-full px-4 py-3 mt-1 border border-forest/30 text-forest text-sm font-light tracking-widest hover:bg-forest hover:text-ivory transition-all duration-300"
                  >
                    {t('nav_login')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';



const WhatsAppIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ivory-deep border-t border-linen">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex flex-col leading-none group mb-6 inline-block">
              <span className="font-display text-3xl font-semibold text-forest tracking-widest transition-all duration-300 group-hover:text-gold">
                ROYALE SLEEPY
              </span>
              <span className="font-body text-[0.55rem] tracking-[0.25em] text-stone/70 uppercase mt-1">
                Sree Sainath Enterprise
              </span>
            </Link>
            <p className="text-sm mb-6 leading-relaxed text-stone font-light">
              {t('footer_tagline')}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { Icon: WhatsAppIcon,  href: 'https://wa.me/918763600036', label: 'WhatsApp' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-linen flex items-center justify-center text-stone hover:border-gold hover:text-gold transition-all duration-500"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="font-display text-lg text-bark mb-6 tracking-wide font-medium">{t('footer_products')}</h4>
            <ul className="space-y-3">
              {[
                { label: 'Mattresses & Pillows', to: '/products?cat=mattresses' },
                { label: 'Sofa & Furniture Foam', to: '/products?cat=sofa' },
                { label: 'Industrial Foam', to: '/products?cat=industrial' },
                { label: 'Custom Orders', to: '/contact' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to}
                    className="text-sm font-light text-stone hover:text-forest transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-display text-lg text-bark mb-6 tracking-wide font-medium">{t('footer_company')}</h4>
            <ul className="space-y-3">
              {[
                { label: t('footer_about'),   to: '/about' },
                { label: t('footer_contact'), to: '/contact' },
                { label: t('footer_privacy'), to: '/privacy' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to}
                    className="text-sm font-light text-stone hover:text-forest transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://www.royalesleepy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-light text-gold hover:text-forest transition-colors duration-300"
                >
                  <Globe size={13} />
                  {t('footer_website')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-display text-lg text-bark mb-6 tracking-wide font-medium">{t('footer_contact')}</h4>
            <ul className="space-y-4">
              {/* Multiple phones */}
              <li>
                <div className="flex items-start gap-3 group">
                  <Phone size={15} className="mt-0.5 flex-shrink-0 text-gold" />
                  <div className="flex flex-col gap-1">
                    <a href="tel:+918763600036" className="text-sm font-light text-stone hover:text-forest transition-colors duration-300">
                      +91 87636 00036
                    </a>
                    <a href="tel:+919937455636" className="text-sm font-light text-stone hover:text-forest transition-colors duration-300">
                      +91 99374 55636
                    </a>
                    <a href="tel:+919583432238" className="text-sm font-light text-stone hover:text-forest transition-colors duration-300">
                      +91 95834 32238
                    </a>
                  </div>
                </div>
              </li>
              <li>
                <a href={`mailto:${t('footer_email')}`}
                  className="flex items-start gap-3 text-sm font-light text-stone hover:text-forest transition-colors duration-300 group"
                >
                  <Mail size={15} className="mt-0.5 flex-shrink-0 text-gold" />
                  <span>{t('footer_email')}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=Plot+No+1574+OCC+Chhaka+Tapanga+Khordha+Odisha+752018"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-sm font-light text-stone hover:text-forest transition-colors duration-300 group"
                >
                  <MapPin size={15} className="mt-0.5 flex-shrink-0 text-gold" />
                  <span>{t('footer_address')}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-linen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-light text-stone/60 tracking-wider">
            © {year} Royale Sleepy · Sree Sainath Enterprise. {t('footer_rights')}
          </p>
          <div className="flex items-center gap-2 px-4 py-1.5 border border-gold/30 text-[10px] tracking-widest uppercase font-light text-gold">
            {t('footer_made_india')}
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Award, ShieldCheck, Users, Truck, VolumeX, Volume2 } from 'lucide-react';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

export default function HomePage() {
  const { t } = useLanguage();
  const { settings } = useAdmin();
  const heroRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const el = heroRef.current;
    const onScroll = () => {
      if (el) el.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-ivory text-bark font-body selection:bg-gold/20 selection:text-bark">

      {/* ── HERO ── */}
      <section className="relative h-screen w-full bg-bark overflow-hidden border-b border-linen">
        <div ref={heroRef} className="absolute inset-0 h-full w-full will-change-transform bg-black">
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src={`/${settings.heroVideo}`} type="video/mp4" />
          </video>
        </div>

        <div className="absolute inset-0 z-[5] bg-gradient-to-b from-black/60 via-black/30 to-black/60" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center animate-fade-in px-6">
          <p className="font-body text-[10px] sm:text-xs uppercase tracking-[0.5em] text-gold/90 mb-6">
            Sree Sainath Enterprise
          </p>
          <h1 className="font-body text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] text-white text-center leading-[1.2] uppercase animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            Royale Sleepy
          </h1>
          <h2 className="font-body text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.3em] text-gold/80 mt-2 uppercase animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
            Comfort.
          </h2>
          <div className="mt-12 flex flex-col items-center gap-8 animate-zoom-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold to-transparent animate-line-expand"></div>
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-white/70 text-center max-w-md">
              {t('hero_subtagline')}
            </p>
            <Link
              to="/products"
              className="mt-4 px-10 py-4 border border-white/60 text-white text-[10px] tracking-[0.4em] uppercase font-medium hover:bg-white hover:text-bark transition-all duration-500"
            >
              {t('hero_cta_primary')}
            </Link>
          </div>
        </div>

        {/* Audio Toggle Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-10 right-10 z-30 px-6 py-4 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-pulse"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          <span className="font-body text-xs font-bold uppercase tracking-widest">
            {isMuted ? "Click for Sound" : "Sound On"}
          </span>
        </button>
      </section>

      {/* ── ABOUT / VISION ── */}
      <section className="bg-ivory py-28 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.025] select-none pointer-events-none">
          <span className="font-display text-[22vw] text-bark leading-none">SLEEP</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

            <div className="lg:col-span-5 relative animate-slide-right">
              <div className="aspect-[4/5] overflow-hidden border border-linen group shadow-sm bg-white rounded-xl">
                <img
                  src={settings.homeAboutImage || "https://images.unsplash.com/photo-1584036533827-45bce1666e82?q=80&w=1200&auto=format&fit=crop"}
                  alt="Royale Sleepy Mattress"
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bark/30 via-transparent to-transparent pointer-events-none"></div>
              </div>
              <div className="absolute -inset-4 border-2 border-gold/20 -z-10 translate-x-4 translate-y-4 hidden md:block rounded-xl"></div>
            </div>

            <div className="lg:col-span-7 space-y-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-[1px] bg-gold"></div>
                  <span className="font-body text-[10px] tracking-[0.5em] text-gold uppercase">What's Inside</span>
                </div>
                <h2 className="font-display text-5xl md:text-6xl text-bark font-light leading-[0.9] mb-10">
                  Engineered <br/>
                  <span className="italic text-gold">Layer by Layer.</span>
                </h2>
                <p className="font-body text-lg md:text-xl text-stone leading-relaxed font-light mb-8 max-w-xl">
                  "Every Royale Sleepy mattress is built with precision — layer by layer — to deliver enhanced breathability, perfect pressure relief, and all-night temperature control."
                </p>
                <div className="space-y-4 max-w-xl mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { dot: 'bg-sky-300', label: 'Cooling Comfort Layer', desc: 'Temperature regulation for cool sleep' },
                      { dot: 'bg-amber-700', label: 'Natural Coir Support', desc: 'Firm base for spinal alignment' },
                      { dot: 'bg-purple-300', label: 'Memory Foam Core', desc: 'Pressure point relief & body contouring' },
                      { dot: 'bg-gray-200', label: 'Spring Bonnel System', desc: 'Bounce & enhanced air circulation' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <span className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 ${item.dot} border border-stone/20`}></span>
                        <div>
                          <p className="font-body text-xs font-semibold text-bark">{item.label}</p>
                          <p className="font-body text-[11px] text-stone/60 font-light">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="font-body text-xs text-stone/50 font-light tracking-wider pt-2">
                    Plot No 1574, OCC Chhaka, Tapanga, Khordha, Odisha — 752018
                  </p>
                </div>
              </div>

              <Link to="/about" className="inline-flex items-center gap-5 group mt-4">
                <div className="w-12 h-12 border border-forest/30 flex items-center justify-center text-forest group-hover:bg-forest group-hover:text-ivory transition-all duration-500">
                  <ArrowUpRight size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-body text-[10px] tracking-[0.4em] text-forest uppercase">Our Story</span>
                  <div className="h-[1px] bg-forest/40 w-0 group-hover:w-full transition-all duration-700"></div>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── MATTRESS TYPES ── */}
      <section className="relative bg-ivory-deep py-28 overflow-hidden border-y border-linen">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#B8975A_1px,transparent_1px),linear-gradient(to_bottom,#B8975A_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.04]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-14 h-[1px] bg-gold"></div>
            <span className="font-body text-[10px] tracking-[0.6em] text-gold uppercase">Our Collection</span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl text-bark font-light leading-[0.9] mb-6">
            The <br/>
            <span className="italic text-gold">Art of</span> <br/>
            Rest.
          </h2>
          <p className="font-body text-sm text-stone/60 font-light mb-20 max-w-lg">
            Every Royale Sleepy mattress is crafted to give you the perfect night's sleep — pick the type that suits you best.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                type: 'Ortho Mattress',
                tag: 'Best for Back Pain',
                desc: 'High-density orthopedic foam engineered for superior lumbar support and spinal alignment.',
                badge: '40 kg/m³',
                img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
                color: 'from-amber-900/60',
              },
              {
                id: 3,
                type: 'PU Foam Mattress',
                tag: 'Most Popular',
                desc: 'Premium polyurethane foam that balances softness and support — perfect for all sleep positions.',
                badge: '36 kg/m³',
                img: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&q=80',
                color: 'from-forest/60',
              },
              {
                id: 2,
                type: 'Bonded Foam Mattress',
                tag: 'Budget Friendly',
                desc: 'Durable bonded foam with firm, even support. Built to last — ideal for guest rooms and hostels.',
                badge: '32 kg/m³',
                img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
                color: 'from-bark/60',
              },
              {
                id: 4,
                type: 'Spring Mattress',
                tag: 'Premium Feel',
                desc: 'Individually wrapped pocket coils for zero motion transfer, luxury bounce, and superior airflow.',
                badge: 'Pocket Coil',
                img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
                color: 'from-stone/60',
              },
            ].map((item, i) => (
              <Link to={`/products/${item.id}`} key={item.id} className="group relative block animate-slide-up" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="aspect-[3/4] overflow-hidden border border-linen relative bg-ivory shadow-sm group-hover:shadow-lg transition-all duration-500">
                  <img src={item.img} alt={item.type} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.color} via-bark/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700`}></div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-gold/90 backdrop-blur-sm px-2 py-1">
                    <span className="font-body text-[9px] tracking-widest text-white uppercase">{item.badge}</span>
                  </div>

                  {/* Tag */}
                  <div className="absolute top-4 left-4 border border-white/40 px-2 py-1 backdrop-blur-sm">
                    <span className="font-body text-[9px] tracking-widest text-white/90 uppercase">{item.tag}</span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="font-display text-xl text-ivory font-medium tracking-wide uppercase mb-2">{item.type}</h3>
                    <p className="font-body text-[11px] text-white/70 leading-relaxed font-light max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500">{item.desc}</p>
                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="font-body text-[9px] tracking-[0.3em] text-gold uppercase">View Details</span>
                      <div className="w-4 h-[1px] bg-gold"></div>
                    </div>
                    <div className="w-0 group-hover:w-full h-[1px] bg-gold/60 mt-2 transition-all duration-700"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/products" className="inline-flex items-center gap-4 border border-bark/30 px-10 py-4 text-bark text-[11px] tracking-[0.3em] uppercase font-medium hover:bg-bark hover:text-ivory transition-all duration-500">
              View All Mattresses
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="bg-ivory py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mb-20">
            <span className="font-body text-[10px] tracking-[0.5em] text-gold uppercase block mb-6">Why Choose Royale Sleepy</span>
            <h2 className="font-display text-5xl md:text-6xl text-bark font-light leading-[0.9] mb-8">
              Crafted for <br/>
              <span className="italic text-gold">Lasting</span> Comfort.
            </h2>
            <p className="font-body text-sm text-stone/70 leading-relaxed font-light">
              Every mattress we offer is a promise of premium quality, durability, and the sleep your body needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: t('why_quality'), desc: t('why_quality_desc'), icon: Award },
              { num: '02', title: t('why_iso'), desc: t('why_iso_desc'), icon: ShieldCheck },
              { num: '03', title: 'Expert Guidance', desc: 'Our team at Tapanga, Khordha helps you choose the perfect mattress for your needs and budget.', icon: Users },
              { num: '04', title: t('why_delivery'), desc: t('why_delivery_desc'), icon: Truck },
            ].map((item) => (
              <div key={item.num} className="group relative p-8 md:p-10 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(184,151,90,0.15)] hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-transparent hover:border-gold/20">
                {/* Watermark Number */}
                <div className="absolute -right-4 -bottom-6 text-[120px] font-display font-bold text-stone/5 group-hover:text-gold/5 transition-colors duration-500 select-none pointer-events-none">
                  {item.num}
                </div>
                
                {/* Icon */}
                <div className="w-14 h-14 bg-ivory-deep text-gold rounded-full flex items-center justify-center mb-8 group-hover:bg-gold group-hover:text-white transition-colors duration-500 shadow-sm relative z-10">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                
                <h3 className="font-display text-2xl text-bark font-bold tracking-wide mb-4 relative z-10">{item.title}</h3>
                <p className="font-body text-sm text-stone/70 leading-relaxed font-light relative z-10">{item.desc}</p>
                
                {/* Accent line on hover */}
                <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-gold group-hover:w-full transition-all duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="bg-forest py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-ivory font-light tracking-wide mb-2">
              Ready to Sleep <span className="italic text-gold-light">Royally?</span>
            </h2>
            <p className="font-body text-sm text-ivory/60 font-light">
              Visit us or enquire via WhatsApp — fast response guaranteed.
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <a
              href="https://wa.me/918763600036?text=Hi%2C%20I%27m%20interested%20in%20Royale%20Sleepy%20mattresses."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gold text-ivory text-[10px] tracking-[0.3em] uppercase font-medium hover:bg-gold-light transition-all duration-300"
            >
              WhatsApp Us
            </a>
            <Link
              to="/products"
              className="px-8 py-4 border border-ivory/30 text-ivory text-[10px] tracking-[0.3em] uppercase font-medium hover:border-ivory/70 transition-all duration-300"
            >
              Browse All
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

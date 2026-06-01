import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Award, Shield, Heart, Gem, Star, Users } from 'lucide-react';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const milestones = [
  { year: '2015', title: 'Foundation', desc: 'Sree Sainath Enterprise was established with a vision to bring premium mattresses to Odisha.' },
  { year: '2018', title: 'Royale Sleepy Partnership', desc: 'Became an authorised dealer of Royale Sleepy, the premium mattress brand.' },
  { year: '2021', title: 'New Showroom', desc: 'Expanded operations at Plot No 1574, OCC Chhaka, Tapanga, Khordha.' },
  { year: '2024', title: 'Digital Presence', desc: 'Launched online presence to reach customers across Odisha and beyond.' },
];

const values = [
  { icon: Award, title: 'Premium Quality', desc: 'We only source and sell the highest grade materials for ultimate comfort.' },
  { icon: Heart, title: 'Customer First', desc: 'Your sleep quality and satisfaction are at the core of everything we do.' },
  { icon: Shield, title: 'Trusted Legacy', desc: 'Over 9 years of trusted service providing mattresses to homes in Odisha.' },
  { icon: Gem, title: 'Royal Aesthetics', desc: 'We believe your bedroom should look as luxurious as it feels.' },
];

export default function AboutPage() {
  const { t } = useLanguage();
  const [hoveredYear, setHoveredYear] = useState('2024');

  return (
    <div className="min-h-screen bg-ivory text-bark font-body selection:bg-gold/20 selection:text-bark">

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-ivory border-b border-linen">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#B8975A_1px,transparent_1px),linear-gradient(to_bottom,#B8975A_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.04]" />
        
        {/* Soft Glow Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gold/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-20 animate-fade-in">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-gold/60"></div>
            <span className="font-body text-[10px] uppercase tracking-[0.5em] text-gold font-medium">Our Story</span>
            <div className="w-12 h-[1px] bg-gold/60"></div>
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-wide text-bark leading-[0.9] uppercase mb-8">
            The Pursuit of <br/> <span className="italic text-gold">Perfect Sleep.</span>
          </h1>
          <p className="font-body text-stone text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
            {t('about_description') || "We don't just sell mattresses; we curate the foundation of your daily energy. Sree Sainath Enterprise has been transforming bedrooms into royal sanctuaries since 2015."}
          </p>
        </div>
      </section>

      {/* ── STATS GRID ── */}
      <section className="relative py-20 border-b border-linen bg-ivory-deep">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 divide-x divide-linen">
            {[
              { icon: Star, value: '9+', label: 'Years Serving Odisha' },
              { icon: Users, value: '5000+', label: 'Happy Customers' },
              { icon: Award, value: '50+', label: 'Products Available' },
              { icon: Shield, value: '100%', label: 'Quality Assured' },
            ].map((s, i) => (
              <div key={i} className="text-center group px-4">
                <s.icon className="w-5 h-5 mx-auto mb-4 text-gold/40 group-hover:text-gold transition-colors duration-500" />
                <div className="font-display text-4xl md:text-5xl text-forest font-light tracking-widest mb-3 group-hover:text-gold transition-colors duration-500">
                  {s.value}
                </div>
                <div className="font-body text-[9px] uppercase tracking-[0.2em] text-stone/60 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE TIMELINE ── */}
      <section className="py-32 relative overflow-hidden bg-ivory border-b border-linen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-20">
            
            {/* Left: Sticky Title & Hover Image */}
            <div className="lg:w-1/3 relative">
              <div className="sticky top-40">
                <span className="font-body text-[10px] tracking-[0.5em] text-gold uppercase font-medium block mb-6">Timeline</span>
                <h2 className="font-display text-5xl md:text-6xl text-bark font-light leading-[0.9] mb-12">
                  Our <br/>
                  <span className="italic text-gold">Journey.</span>
                </h2>
                
                {/* Visualizer for timeline */}
                <div className="w-full aspect-square border border-linen rounded-2xl flex items-center justify-center relative overflow-hidden bg-ivory-deep">
                  <div className="absolute inset-0 bg-gold/5 mix-blend-multiply"></div>
                  <div className="text-[8rem] font-display text-bark/5 select-none transition-all duration-700 ease-out transform group-hover:scale-110">
                    {hoveredYear}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="h-[1px] w-full bg-linen">
                      <div className="h-[1px] bg-gold w-1/3 transition-all duration-700"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Timeline items */}
            <div className="lg:w-2/3">
              <div className="space-y-12">
                {milestones.map((m, i) => (
                  <div 
                    key={m.year} 
                    className="group relative p-8 md:p-10 border border-linen bg-white hover:border-gold/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-500 cursor-default"
                    onMouseEnter={() => setHoveredYear(m.year)}
                  >
                    <div className="absolute -left-[1px] top-10 bottom-10 w-[2px] bg-gold/0 group-hover:bg-gold transition-colors duration-500"></div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-body text-[11px] tracking-[0.4em] text-gold uppercase font-medium">{m.year}</span>
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl text-bark font-light mb-3">{m.title}</h3>
                    <p className="font-body text-sm text-stone leading-relaxed font-light">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="py-32 bg-ivory-deep">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="font-body text-[10px] tracking-[0.5em] text-gold uppercase font-medium block mb-6">Philosophy</span>
            <h2 className="font-display text-4xl md:text-5xl text-bark font-light leading-[0.95]">
              Why Choose <br/><span className="italic text-gold">Royale Sleepy?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="p-8 border border-linen bg-white hover:border-gold/30 hover:shadow-lg shadow-sm transition-all duration-300 rounded-2xl group">
                <div className="w-12 h-12 rounded-xl bg-ivory-deep border border-linen flex items-center justify-center mb-6 group-hover:bg-gold/10 group-hover:border-gold/20 transition-all">
                  <v.icon size={20} className="text-gold" />
                </div>
                <h3 className="font-display text-xl text-bark font-medium mb-3">{v.title}</h3>
                <p className="font-body text-xs text-stone leading-relaxed font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 relative overflow-hidden bg-forest">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-display text-4xl md:text-6xl text-ivory font-light tracking-wide mb-6 leading-[1.1]">
            Ready to upgrade your <br/><span className="italic text-gold">sleep experience?</span>
          </h2>
          <p className="font-body text-sm text-ivory/60 font-light mb-12 max-w-lg mx-auto leading-relaxed">
            Visit our showroom in Khordha to feel the Royale difference, or browse our collection online.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Link to="/products"
              className="inline-flex items-center gap-4 px-8 py-4 bg-gold text-bark text-[10px] tracking-widest uppercase font-bold hover:bg-white transition-all duration-300 rounded-lg shadow-[0_4px_15px_rgba(201,168,76,0.3)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.4)]"
            >
              Browse Collection <ArrowRight size={14} />
            </Link>
            <Link to="/contact"
              className="inline-flex items-center gap-4 px-8 py-4 border border-white/20 text-white text-[10px] tracking-widest uppercase font-medium hover:border-white/60 hover:bg-white/5 transition-all duration-300 rounded-lg"
            >
              Visit Showroom
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { useState } from 'react';
import { Phone, Mail, MapPin, Send, Globe, ExternalLink, MessageCircle } from 'lucide-react';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const MAP_URL = 'https://www.google.com/maps?q=Plot+No+1574+OCC+Chhaka+Tapanga+Khordha+Odisha+752018';
const EMBED_URL = 'https://maps.google.com/maps?q=Tapanga,+Khordha,+Odisha+752018&t=&z=15&ie=UTF8&iwloc=&output=embed';

export default function ContactPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 400);
  };

  const handleWhatsApp = () => {
    const name = form.name || user?.name || 'Customer';
    const phone = form.phone || user?.phone || 'N/A';
    const msg = `Hi Sree Sainath Enterprise!\n\nI'd like to enquire about Royale Sleepy mattresses.\n\nName: ${name}\nPhone: ${phone}\nMessage: ${form.message || 'Please share product details.'}`;
    window.open(`https://wa.me/918763600036?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-ivory text-bark font-body">

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-bark">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory to-transparent z-10" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-20">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-10 h-[1px] bg-gold/50"></div>
            <span className="font-body text-[9px] uppercase tracking-[0.6em] text-gold">Get In Touch</span>
            <div className="w-10 h-[1px] bg-gold/50"></div>
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-light text-white tracking-wide leading-none mb-6">
            Let's <span className="italic text-gold">Talk.</span>
          </h1>
          <p className="font-body text-white/50 text-sm font-light max-w-md mx-auto leading-relaxed">
            Visit our showroom, call us, or send us a WhatsApp message. We're always happy to help.
          </p>
        </div>
      </section>

      {/* ── QUICK CONTACT CARDS ── */}
      <section className="max-w-6xl mx-auto px-6 -mt-6 relative z-20 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: Phone,
              title: 'Call Us',
              lines: ['+91 87636 00036', '+91 99374 55636', '+91 95834 32238'],
              href: 'tel:+918763600036',
              color: 'from-blue-500/10 to-blue-500/5',
              iconBg: 'bg-blue-50 text-blue-600',
            },
            {
              icon: WhatsAppIcon,
              title: 'WhatsApp',
              lines: ['+91 87636 00036', 'Tap to chat instantly'],
              href: 'https://wa.me/918763600036?text=Hi%20Sree%20Sainath%20Enterprise!',
              color: 'from-green-500/10 to-green-500/5',
              iconBg: 'bg-green-50 text-green-600',
            },
            {
              icon: Mail,
              title: 'Email Us',
              lines: ['sainathenterprise70', '@gmail.com'],
              href: 'mailto:sainathenterprise70@gmail.com',
              color: 'from-gold/10 to-gold/5',
              iconBg: 'bg-amber-50 text-amber-600',
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group bg-gradient-to-br ${card.color} border border-linen rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <card.icon size={22} />
              </div>
              <h3 className="font-display text-lg text-bark font-medium mb-3">{card.title}</h3>
              {card.lines.map((line, i) => (
                <p key={i} className="font-body text-sm text-stone/70 font-light leading-relaxed">{line}</p>
              ))}
              <div className="mt-4 flex items-center gap-2 text-gold font-body text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                <span>Contact Now</span>
                <ExternalLink size={12} />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── MAP + FORM ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* Left: Map */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MapPin size={18} className="text-gold" />
                <h2 className="font-display text-2xl text-bark font-light">Find Us</h2>
              </div>
              <p className="font-body text-sm text-stone/60 font-light">
                Plot No 1574, OCC Chhaka, Tapanga, Khordha, Odisha — 752018
              </p>
            </div>

            {/* Embedded Map */}
            <div className="relative rounded-2xl overflow-hidden border border-linen shadow-md group cursor-pointer"
              onClick={() => window.open(MAP_URL, '_blank')}>
              <iframe
                title="Sree Sainath Enterprise Location"
                src={EMBED_URL}
                width="100%"
                height="380"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none"
              />
              {/* Overlay: tap to open */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white rounded-full px-6 py-3 flex items-center gap-3 shadow-xl font-body text-sm font-semibold text-bark">
                  <MapPin size={16} className="text-gold" />
                  Open in Google Maps
                  <ExternalLink size={14} className="text-stone/50" />
                </div>
              </div>
            </div>

            {/* Address card */}
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-white border border-linen rounded-2xl hover:border-gold/30 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-gold" />
              </div>
              <div className="flex-1">
                <p className="font-body text-xs text-stone/50 uppercase tracking-widest mb-1">Our Showroom</p>
                <p className="font-body text-sm text-bark font-medium">Plot No 1574, OCC Chhaka</p>
                <p className="font-body text-xs text-stone/60">Tapanga, Khordha, Odisha — 752018</p>
              </div>
              <ExternalLink size={16} className="text-stone/30 group-hover:text-gold transition-colors flex-shrink-0" />
            </a>

            {/* Business + Website */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white border border-linen rounded-2xl">
                <p className="font-body text-[9px] uppercase tracking-widest text-stone/40 mb-2">GST Number</p>
                <p className="font-body text-sm text-bark font-semibold">21HJ0PD6793P1Z0</p>
                <p className="font-body text-xs text-stone/50 mt-1">Sree Sainath Enterprise</p>
              </div>
              <a
                href="https://www.royalesleepy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 bg-white border border-linen rounded-2xl hover:border-gold/30 transition-all group"
              >
                <p className="font-body text-[9px] uppercase tracking-widest text-stone/40 mb-2">Website</p>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-gold" />
                  <p className="font-body text-sm text-bark font-semibold group-hover:text-gold transition-colors">royalesleepy.com</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div>
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-linen p-10">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <MessageCircle size={36} className="text-green-500" />
                </div>
                <h3 className="font-display text-3xl text-bark font-light mb-3">Message Sent!</h3>
                <p className="font-body text-sm text-stone/60 font-light max-w-xs leading-relaxed mb-8">
                  Thank you for reaching out. We'll get back to you soon, or you can WhatsApp us for a faster reply.
                </p>
                <button onClick={handleWhatsApp}
                  className="flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white font-body text-sm font-semibold rounded-2xl hover:bg-[#1eb358] transition-colors shadow-lg shadow-green-500/20">
                  <WhatsAppIcon size={18} />
                  Chat on WhatsApp
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-linen p-8 shadow-sm">
                <div className="mb-8">
                  <h2 className="font-display text-2xl text-bark font-light mb-2">Send a Message</h2>
                  <p className="font-body text-xs text-stone/50">Fill in the form or use WhatsApp for a faster response.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'name', label: 'Your Name', type: 'text', required: true, placeholder: 'Ramesh Kumar' },
                      { key: 'phone', label: 'Mobile Number', type: 'tel', required: true, placeholder: '+91 98765 43210' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block font-body text-[10px] uppercase tracking-widest text-stone/50 mb-2">
                          {field.label}{field.required && <span className="text-gold ml-1">*</span>}
                        </label>
                        <input
                          type={field.type}
                          required={field.required}
                          value={form[field.key]}
                          onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                          onFocus={() => setFocused(field.key)}
                          onBlur={() => setFocused('')}
                          placeholder={field.placeholder}
                          className={`w-full px-4 py-3 bg-ivory border rounded-xl font-body text-sm text-bark placeholder-stone/30 outline-none transition-all ${focused === field.key ? 'border-gold/60 bg-white shadow-sm' : 'border-linen'}`}
                        />
                      </div>
                    ))}
                  </div>

                  {[
                    { key: 'email', label: 'Email (optional)', type: 'email', placeholder: 'your@email.com' },
                    { key: 'subject', label: 'Subject', type: 'text', placeholder: 'e.g. Queen size mattress enquiry' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block font-body text-[10px] uppercase tracking-widest text-stone/50 mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        value={form[field.key]}
                        onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                        onFocus={() => setFocused(field.key)}
                        onBlur={() => setFocused('')}
                        placeholder={field.placeholder}
                        className={`w-full px-4 py-3 bg-ivory border rounded-xl font-body text-sm text-bark placeholder-stone/30 outline-none transition-all ${focused === field.key ? 'border-gold/60 bg-white shadow-sm' : 'border-linen'}`}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block font-body text-[10px] uppercase tracking-widest text-stone/50 mb-2">
                      Your Message <span className="text-gold">*</span>
                    </label>
                    <textarea
                      required rows={5}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused('')}
                      placeholder="Tell us what product you're interested in, your budget, or any questions..."
                      className={`w-full px-4 py-3 bg-ivory border rounded-xl font-body text-sm text-bark placeholder-stone/30 outline-none resize-none transition-all ${focused === 'message' ? 'border-gold/60 bg-white shadow-sm' : 'border-linen'}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button type="submit"
                      className="flex items-center justify-center gap-2 py-4 bg-bark text-white font-body text-xs tracking-widest uppercase font-semibold rounded-xl hover:bg-bark/80 transition-all">
                      <Send size={14} />
                      Send Message
                    </button>
                    <button type="button" onClick={handleWhatsApp}
                      className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-body text-xs tracking-widest uppercase font-semibold rounded-xl hover:bg-[#1eb358] transition-all shadow-lg shadow-green-500/10">
                      <WhatsAppIcon size={14} />
                      WhatsApp
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

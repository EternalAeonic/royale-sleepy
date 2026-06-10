import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Truck, Shield, RotateCcw, ArrowLeft, MapPin, Globe, ChevronLeft, ChevronRight
} from 'lucide-react';
import StarRating from '../components/StarRating';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';

const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const TABS = ['pd_tab_desc', 'pd_tab_mfg', 'pd_tab_material', 'pd_tab_reviews'];

export default function ProductDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { products } = useAdmin();
  const { user } = useAuth();

  const product = products.find(p => String(p.id) === String(id));
  const [mainImg, setMainImg]           = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [activeTab, setActiveTab]       = useState(0);

  // Get price for the currently selected size
  const currentPrice = (product?.sizePrices?.[selectedSize]) || product?.price || 0;
  const currentMrp = product?.mrp || 0;
  const currentSavings = currentMrp - currentPrice;

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="font-display text-4xl font-light text-bark mb-6 tracking-wide">Product Not Found</div>
          <Link to="/products" className="inline-flex items-center gap-4 text-forest border border-forest/40 px-8 py-3 uppercase tracking-widest text-xs hover:bg-forest hover:text-ivory transition-all duration-300">
            <ArrowLeft size={16} /> Return to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const greeting = user?.name ? `Hi, I'm *${user.name}*.` : `Hi,`;
    const msg = `${greeting}\n\nI'm interested in:\n\n*${product.name}* (Royale Sleepy)\nVariant: ${selectedSize}\nPrice: ₹${currentPrice.toLocaleString('en-IN')}\nQty: 1\n\nPlease confirm availability and delivery details.\n\nThank you!`;
    window.open(`https://wa.me/918763600036?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-ivory selection:bg-gold/20 selection:text-bark">
      {/* Breadcrumb */}
      <div className="pt-32 pb-8 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.3em] text-stone/50 font-body">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="w-4 h-[1px] bg-linen" />
          <Link to="/products" className="hover:text-gold transition-colors">Products</Link>
          <span className="w-4 h-[1px] bg-linen" />
          <span className="text-gold truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">

          {/* ── LEFT: Image Gallery ── */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="w-full aspect-[4/5] bg-ivory-deep border border-linen relative overflow-hidden group rounded-xl shadow-sm">
              <button 
                onClick={() => setMainImg(p => (p - 1 + product.images.length) % product.images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-white/80 hover:bg-white text-bark rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <ChevronLeft size={24} />
              </button>
              
              <img
                key={mainImg}
                src={product.images[mainImg]}
                alt={product.name}
                className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-1000 animate-fade-in"
              />
              
              <button 
                onClick={() => setMainImg(p => (p + 1) % product.images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-white/80 hover:bg-white text-bark rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute inset-0 bg-gradient-to-t from-bark/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
              {product.discount > 0 && (
                <div className="absolute top-6 left-6 text-gold text-[10px] tracking-[0.3em] uppercase border border-gold/40 bg-ivory/90 px-3 py-1.5 backdrop-blur-sm z-10 rounded">
                  {product.discount}% off
                </div>
              )}

              {/* Navigation Dots */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-10">
                {product.images.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setMainImg(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${mainImg === i ? 'bg-white w-6' : 'bg-white/50 w-2 hover:bg-white/80'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="lg:col-span-5 flex flex-col justify-center">

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-[1px] bg-gold/50"></div>
                <span className="font-body text-[9px] uppercase tracking-[0.4em] text-gold">
                  {t('pd_brand')}: {product.brand}
                </span>
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-medium tracking-wide text-bark leading-tight uppercase mb-5">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <StarRating rating={product.rating} size={12} />
                <span className="text-[10px] tracking-[0.2em] font-light text-stone/60 uppercase">
                  {product.reviewCount} Reviews
                </span>
              </div>
            </div>

            {/* Price Block */}
            <div className="py-6 border-y border-linen mb-8">
              <div className="flex items-end gap-5 mb-2">
                <span className="font-display text-4xl text-forest tracking-widest leading-none font-semibold">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                {currentMrp > currentPrice && (
                  <span className="font-body text-xs text-stone/40 line-through tracking-[0.2em] mb-1">
                    ₹{currentMrp.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-light text-stone/50 mt-3">
                Inclusive of all taxes{currentSavings > 0 && ` · You save ₹${currentSavings.toLocaleString('en-IN')}`}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-5">
                <span className="font-body text-[10px] uppercase tracking-[0.3em] text-stone/60">Select Size / Variant</span>
                <span className="font-body text-[10px] tracking-widest text-gold">{selectedSize}</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-[10px] uppercase tracking-[0.2em] font-light transition-all duration-300 border ${
                      selectedSize === size
                        ? 'border-gold bg-gold text-ivory'
                        : 'border-linen text-stone hover:border-gold/40 hover:text-gold'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Specifications Card */}
            <div className="bg-white rounded-xl shadow-sm border border-linen p-6 mb-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <div className="text-stone/60 text-xs mb-1">Material</div>
                  <div className="text-bark font-bold text-sm">High-Density Memory Foam</div>
                </div>
                <div>
                  <div className="text-stone/60 text-xs mb-1">Thickness</div>
                  <div className="text-bark font-bold text-sm">6, 8, 10, 12 inches</div>
                </div>
                <div>
                  <div className="text-stone/60 text-xs mb-1">Sizes Available</div>
                  <div className="text-bark font-bold text-sm">Single, Double, Queen, King</div>
                </div>
                <div>
                  <div className="text-stone/60 text-xs mb-1">Warranty</div>
                  <div className="text-bark font-bold text-sm">5 Years</div>
                </div>
              </div>
            </div>

            {/* Size Guide Card */}
            <div className="bg-white rounded-xl shadow-sm border border-linen p-6 mb-8">
              <h3 className="font-display text-2xl font-bold text-bark mb-4">Size Guide</h3>
              <div className="w-full text-sm rounded-lg overflow-hidden border border-[#e6f7e6]">
                <div className="grid grid-cols-3 py-3 px-4 bg-[#e5f5e8] text-bark font-bold">
                  <div>Size</div>
                  <div>Dimensions (inches)</div>
                  <div>Dimensions (cm)</div>
                </div>
                {[
                  { name: 'Single', inches: product.sizeChart?.single || '75" x 36"', cm: '190 x 91 cm' },
                  { name: 'Double', inches: product.sizeChart?.double || '75" x 48"', cm: '190 x 122 cm' },
                  { name: 'Queen',  inches: product.sizeChart?.queen  || '80" x 60"', cm: '203 x 152 cm' },
                  { name: 'King',   inches: product.sizeChart?.king   || '84" x 72"', cm: '213 x 183 cm' },
                ].map((row, i) => (
                  <div key={row.name} className={`grid grid-cols-3 py-3 px-4 border-b border-[#f1f1f1] last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'} ${
                    selectedSize.toLowerCase().startsWith(row.name.toLowerCase()) ? 'bg-gold/5 border-l-2 border-l-gold font-semibold text-bark' : ''
                  }`}>
                    <div>{row.name}</div>
                    <div>{row.inches}</div>
                    <div className="text-stone/50">{row.cm}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="mb-6 relative">
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#67a74a] text-white font-bold rounded-lg hover:bg-[#5b9541] transition-all duration-300 shadow-md"
              >
                <WhatsAppIcon size={20} />
                <span className="text-[15px]">Inquire on WhatsApp</span>
              </button>
            </div>

          </div>
        </div>

        {/* ── TABS ── */}
        <div className="mt-24 pt-12 border-t border-linen">
          <div className="flex flex-wrap gap-8 lg:gap-14 border-b border-linen pb-6 mb-14">
            {TABS.map((tabKey, i) => (
              <button
                key={tabKey}
                onClick={() => setActiveTab(i)}
                className={`font-body text-[10px] uppercase tracking-[0.3em] transition-all duration-300 relative pb-4 ${
                  activeTab === i ? 'text-forest' : 'text-stone/50 hover:text-stone'
                }`}
              >
                {t(tabKey)}
                {activeTab === i && (
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gold"></div>
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl min-h-[280px]">
            {activeTab === 0 && (
              <div className="font-body text-sm md:text-base text-stone font-light leading-relaxed">
                {product.description}
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-6">
                <h3 className="font-display text-3xl font-medium text-bark tracking-wide">
                  Manufacturing <span className="italic text-gold">Excellence</span>
                </h3>
                <p className="font-body text-sm md:text-base text-stone font-light leading-relaxed">
                  {product.manufacturingDetails}
                </p>
              </div>
            )}

            {activeTab === 2 && (
              <div>
                <h3 className="font-display text-3xl font-medium text-bark tracking-wide mb-8">
                  Material <span className="italic text-gold">Quality</span>
                </h3>
                <p className="font-body text-sm text-stone font-light leading-relaxed mb-10 max-w-2xl">
                  {product.materialQuality}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Density', value: product.density },
                    { label: 'Certification', value: 'ISO 9001:2015' },
                    { label: 'Origin', value: 'India' },
                  ].map(s => (
                    <div key={s.label} className="p-6 border border-linen bg-ivory-deep">
                      <div className="font-display text-2xl text-bark tracking-wide mb-3">{s.value}</div>
                      <div className="w-6 h-[1px] bg-gold/40 mb-3"></div>
                      <div className="font-body text-[9px] uppercase tracking-[0.3em] text-stone/50">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div>
                <div className="flex items-center gap-10 mb-14 border-b border-linen pb-10">
                  <div className="text-center">
                    <div className="font-display text-7xl font-light text-bark leading-none mb-5">{product.rating}</div>
                    <div className="flex justify-center mb-3"><StarRating rating={product.rating} size={14} /></div>
                    <div className="font-body text-[9px] uppercase tracking-[0.3em] text-stone/50">{product.reviewCount} reviews</div>
                  </div>
                </div>

                <div className="space-y-10">
                  {product.reviews.map((rev, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-11 h-11 border border-linen flex items-center justify-center font-display text-lg text-gold bg-ivory-deep shrink-0">
                        {rev.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-body text-sm tracking-widest text-bark uppercase mb-1">{rev.name}</div>
                            <div className="font-body text-[9px] uppercase tracking-[0.3em] text-stone/40">{rev.date}</div>
                          </div>
                          {rev.verified && (
                            <span className="font-body text-[9px] uppercase tracking-[0.3em] text-forest border border-forest/20 px-3 py-1 bg-forest/5">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="mb-3"><StarRating rating={rev.rating} size={10} /></div>
                        <p className="font-body text-sm text-stone font-light leading-relaxed max-w-2xl">{rev.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
      <section className="bg-ivory-deep py-20 border-t border-linen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-[1px] bg-gold"></div>
            <h3 className="font-display text-2xl text-bark tracking-wide font-light uppercase">
              You Might Also Like
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter(p => String(p.id) !== String(id))
              .slice(0, 3)
              .map((relatedProd, idx) => (
                <Link
                  key={relatedProd.id}
                  to={`/products/${relatedProd.id}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group block bg-white border border-linen p-4 hover:shadow-xl transition-all duration-500 animate-slide-up"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-ivory mb-4 relative">
                    <img 
                      src={relatedProd.images[0]} 
                      alt={relatedProd.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                    />
                    <div className="absolute top-3 right-3 bg-gold/90 backdrop-blur-sm px-2 py-1 text-white">
                      <span className="font-body text-[9px] tracking-widest uppercase">{relatedProd.density}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-display text-lg text-bark mb-1 uppercase tracking-wide group-hover:text-gold transition-colors">{relatedProd.name}</h4>
                    <p className="font-body text-xs text-stone/60 mb-3 line-clamp-1">{relatedProd.shortDescription}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-forest font-medium">₹{relatedProd.price.toLocaleString()}</span>
                      <div className="flex items-center gap-1 text-gold">
                        <span className="font-body text-[10px] uppercase tracking-widest">View</span>
                        <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

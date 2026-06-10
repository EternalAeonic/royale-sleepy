import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import StarRating from './StarRating';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const WhatsAppIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function ProductCard({ product }) {
  const { t } = useLanguage();
  const { user } = useAuth();

  // If product.price is 0 or empty, use the lowest price from sizePrices
  const sizePricesValues = product.sizePrices ? Object.values(product.sizePrices).filter(v => v > 0) : [];
  const displayPrice = product.price > 0 ? product.price : (sizePricesValues.length > 0 ? Math.min(...sizePricesValues) : 0);
  const displayMrp = product.mrp > 0 ? product.mrp : 0;
  const isStartingFrom = product.price === 0 && sizePricesValues.length > 0;

  const handleWhatsApp = (e) => {
    e.preventDefault();
    const greeting = user?.name ? `Hi, I'm *${user.name}*.` : `Hi,`;
    const msg = `${greeting} I'm interested in *${product.name}* (${product.sizes[0]}). Please share more details and pricing.`;
    window.open(`https://wa.me/918763600036?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-ivory border border-linen group-hover:border-gold/30 transition-all duration-700 h-full flex flex-col shadow-sm group-hover:shadow-md">

        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/5] bg-ivory-deep">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-104 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bark/20 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700"></div>

          {/* WhatsApp Quick Action */}
          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white text-[10px] tracking-[0.2em] uppercase py-3 font-medium hover:bg-[#1eb358] transition-all duration-300"
            >
              <WhatsAppIcon size={13} />
              Enquire on WhatsApp
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 bg-ivory">
          <div className="flex items-center justify-between mb-3">
            <span className="font-body text-[8px] uppercase tracking-[0.3em] text-gold font-medium">
              {product.brand}
            </span>
            <div className="flex items-center gap-1.5 opacity-70">
              <StarRating rating={product.rating} size={10} />
              <span className="text-[10px] text-stone/60 font-light">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-display font-medium tracking-widest text-bark text-lg mb-2 uppercase">
            {product.name}
          </h3>

          <p className="font-body text-[11px] text-stone font-light line-clamp-2 leading-relaxed mb-5 flex-1">
            {product.shortDescription}
          </p>

          <div className="flex items-end justify-between border-t border-linen pt-4">
            <div className="flex flex-col">
              {isStartingFrom && (
                <span className="font-body text-[8px] uppercase tracking-[0.2em] text-stone/50 mb-0.5">Starting from</span>
              )}
              <span className="font-display text-xl text-forest tracking-widest font-medium">
                {displayPrice > 0 ? `₹${displayPrice.toLocaleString('en-IN')}` : 'Price on request'}
              </span>
              {displayMrp > displayPrice && (
                <span className="font-body text-[9px] text-stone/50 line-through tracking-[0.2em]">
                  ₹{displayMrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="w-8 h-8 border border-linen flex items-center justify-center text-stone group-hover:border-gold group-hover:text-gold transition-colors duration-500">
              <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, Tag } from 'lucide-react';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function CartPage() {
  const { t } = useLanguage();
  const { items, removeFromCart, updateQuantity, subtotal, gst, total, buildWhatsAppMessage } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleWhatsAppOrder = () => {
    const url = buildWhatsAppMessage(user?.name);
    if (url) window.open(url, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-32">
          <div className="text-center max-w-sm">
            <div className="font-display text-4xl text-bark font-light mb-5">Cart is Empty</div>
            <p className="font-body text-stone text-sm font-light mb-10 leading-relaxed">
              Browse our collection of Royale Sleepy mattresses and foam products.
            </p>
            <Link to="/products"
              className="inline-flex items-center gap-4 px-8 py-4 border border-forest/40 text-forest text-[10px] tracking-widest uppercase font-light hover:bg-forest hover:text-ivory transition-all duration-300"
            >
              {t('cart_empty_cta')}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <div className="pt-32 pb-14 bg-ivory-deep border-b border-linen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-stone/60 hover:text-forest mb-7 text-[9px] uppercase tracking-[0.3em] font-body transition-colors"
          >
            <ArrowLeft size={13} /> Back
          </button>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-5xl lg:text-6xl font-light tracking-wide text-bark leading-none uppercase">
              {t('cart_title')}
            </h1>
            <span className="font-body text-gold text-[10px] tracking-[0.3em] uppercase">
              {items.length} {t('cart_items')}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-20">

          {/* Cart Items */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {items.map(item => (
              <div key={item.key}
                className="flex gap-5 pb-6 border-b border-linen group"
              >
                {/* Image */}
                <Link to={`/products/${item.id}`}
                  className="w-24 h-32 md:w-28 md:h-36 border border-linen overflow-hidden shrink-0 bg-ivory-deep"
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col min-w-0">
                  <Link to={`/products/${item.id}`}
                    className="font-display text-xl text-bark tracking-wide uppercase hover:text-forest transition-colors line-clamp-2 leading-tight mb-1.5"
                  >
                    {item.name}
                  </Link>
                  <div className="font-body text-[9px] uppercase tracking-[0.2em] text-stone/50 mb-auto flex items-center gap-2">
                    <Tag size={9} className="text-gold/60" /> {item.selectedSize}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-linen bg-ivory-deep">
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="px-4 py-2 text-stone/50 hover:text-forest hover:bg-linen transition-colors"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="px-4 py-2 font-display text-sm text-bark border-x border-linen min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="px-4 py-2 text-stone/50 hover:text-forest hover:bg-linen transition-colors"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    {/* Price + Remove */}
                    <div className="flex items-end gap-5">
                      <div className="text-right">
                        <div className="font-display text-xl tracking-widest text-forest mb-0.5">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                        {item.quantity > 1 && (
                          <div className="font-body text-[9px] uppercase tracking-widest text-stone/40">
                            ₹{item.price.toLocaleString('en-IN')} each
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        className="pb-1 text-stone/30 hover:text-red-400 transition-colors"
                        title={t('cart_remove')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-ivory-deep p-8 border border-linen sticky top-32">
              <h2 className="font-display text-2xl font-medium tracking-wide text-bark uppercase mb-7 pb-6 border-b border-linen">
                Order Summary
              </h2>

              <div className="space-y-5 mb-7">
                <div className="flex justify-between font-body text-xs font-light">
                  <span className="text-stone/60 uppercase tracking-widest">{t('cart_subtotal')}</span>
                  <span className="text-bark tracking-wider">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-body text-xs font-light">
                  <span className="text-stone/60 uppercase tracking-widest">{t('cart_gst')}</span>
                  <span className="text-bark tracking-wider">₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-body text-xs font-light">
                  <span className="text-stone/60 uppercase tracking-widest">Shipping</span>
                  <span className="text-forest uppercase tracking-widest">To be confirmed</span>
                </div>
              </div>

              <div className="flex justify-between items-end py-5 border-y border-linen mb-7">
                <span className="font-body text-[10px] uppercase tracking-[0.3em] text-stone/60">{t('cart_total')}</span>
                <span className="font-display text-3xl text-forest tracking-widest leading-none">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-between px-8 py-5 bg-[#25D366] text-white uppercase tracking-[0.2em] text-[10px] font-medium hover:bg-[#1eb358] transition-all duration-300 mb-4 group"
              >
                <span>{t('cart_whatsapp_order')}</span>
                <WhatsAppIcon size={15} />
              </button>

              <p className="font-body text-[9px] uppercase tracking-[0.2em] text-stone/40 text-center mb-7 leading-relaxed">
                Final price and delivery will be confirmed via WhatsApp by Sree Sainath Enterprise.
              </p>

              <div className="text-center">
                <Link to="/products"
                  className="inline-flex items-center gap-3 font-body text-[9px] uppercase tracking-[0.3em] text-stone/50 hover:text-forest transition-colors group"
                >
                  <ArrowLeft size={11} className="group-hover:-translate-x-1 transition-transform" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

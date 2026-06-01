import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

const DENSITY_OPTIONS = ['All', '15 kg/m³', '24 kg/m³', '32 kg/m³', '40 kg/m³', '55 kg/m³', '80 kg/m³'];

export default function ProductsPage() {
  const { t } = useLanguage();
  const { products, categories } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCat, setSelectedCat] = useState(searchParams.get('cat') || 'all');
  const [maxPrice, setMaxPrice] = useState(25000);
  const [selectedDensity, setSelectedDensity] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setSelectedCat(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCat !== 'all') list = list.filter(p => p.category === selectedCat);
    list = list.filter(p => p.price <= maxPrice);
    if (selectedDensity !== 'All') list = list.filter(p => p.density === selectedDensity);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
    }
    if (sortBy === 'price_asc')  list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')     list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [selectedCat, maxPrice, selectedDensity, search, sortBy]);

  const clearFilters = () => {
    setSelectedCat('all');
    setMaxPrice(25000);
    setSelectedDensity('All');
    setSearch('');
    setSortBy('default');
    setSearchParams({});
  };

  const hasActiveFilters = selectedCat !== 'all' || maxPrice < 25000 || selectedDensity !== 'All' || search.trim();

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-display tracking-widest text-bark mb-4 uppercase text-sm">
          {t('products_filter_category')}
        </h4>
        <div className="space-y-1">
          {[{ id: 'all', label: t('products_all') }, ...categories].map(cat => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCat(cat.id); setSearchParams(cat.id !== 'all' ? { cat: cat.id } : {}); }}
              className={`w-full text-left px-3 py-2 text-sm font-light tracking-wide transition-all duration-300 ${
                selectedCat === cat.id ? 'text-forest bg-ivory-deep border-l-2 border-gold' : 'text-stone hover:bg-ivory-deep hover:text-bark'
              }`}
            >
              {cat.label || cat.id}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[1px] bg-linen" />

      {/* Price Range */}
      <div>
        <h4 className="font-display tracking-widest text-bark mb-4 uppercase text-sm">
          {t('products_filter_price')}
        </h4>
        <div className="px-1">
          <input
            type="range" min={500} max={25000} step={500}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="w-full cursor-pointer accent-gold"
            style={{ accentColor: '#B8975A' }}
          />
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-stone/50 mt-3 font-light">
            <span>₹500</span>
            <span className="text-gold">Up to ₹{maxPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-linen" />

      {/* Density */}
      <div>
        <h4 className="font-display tracking-widest text-bark mb-4 uppercase text-sm">
          {t('products_filter_density')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {DENSITY_OPTIONS.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDensity(d)}
              className={`px-3 py-1.5 border text-[10px] uppercase tracking-widest transition-all duration-300 ${
                selectedDensity === d ? 'border-gold text-ivory bg-gold' : 'border-linen text-stone hover:border-gold/40 hover:text-gold'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 py-3 mt-6 border border-forest/40 text-forest text-[10px] tracking-widest uppercase font-light hover:bg-forest hover:text-ivory transition-all duration-300"
        >
          <X size={13} />
          {t('products_filter_clear')}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory">
      {/* Page Header */}
      <div className="pt-32 pb-14 border-b border-linen bg-ivory-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-[1px] bg-gold"></div>
            <span className="font-body text-[10px] tracking-[0.6em] text-gold uppercase">Browse Collection</span>
          </div>
          <h1 className="font-display text-5xl lg:text-7xl font-light tracking-wide text-bark mb-3 leading-none">{t('products_title')}</h1>
          <p className="text-stone/50 font-light tracking-widest uppercase text-xs">{filtered.length} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-28 p-6 bg-ivory-deep border border-linen">
              <Sidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-linen text-stone text-xs tracking-widest uppercase hover:text-gold hover:border-gold/30 transition-all"
              >
                <SlidersHorizontal size={13} />
                Filters {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-gold ml-1" />}
              </button>

              {/* Search */}
              <div className="flex-1 min-w-[200px] relative">
                <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone/40" />
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 bg-ivory-deep border border-linen text-bark text-sm outline-none focus:border-gold/50 transition-colors font-light tracking-wide placeholder:text-stone/40"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-ivory-deep border border-linen text-stone text-xs tracking-widest uppercase outline-none cursor-pointer hover:border-gold/30 transition-colors"
                >
                  <option value="default">{t('products_sort_default')}</option>
                  <option value="price_asc">{t('products_sort_price_asc')}</option>
                  <option value="price_desc">{t('products_sort_price_desc')}</option>
                  <option value="rating">{t('products_sort_rating')}</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {selectedCat !== 'all' && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-widest font-medium text-ivory bg-forest">
                    {categories.find(c => c.id === selectedCat)?.label}
                    <button onClick={() => { setSelectedCat('all'); setSearchParams({}); }}><X size={11} /></button>
                  </span>
                )}
                {maxPrice < 25000 && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-widest font-medium text-ivory bg-gold">
                    Max ₹{maxPrice.toLocaleString('en-IN')}
                    <button onClick={() => setMaxPrice(25000)}><X size={11} /></button>
                  </span>
                )}
                {selectedDensity !== 'All' && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-widest font-medium text-ivory bg-gold">
                    {selectedDensity}
                    <button onClick={() => setSelectedDensity('All')}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-28 border border-linen bg-ivory-deep">
                <div className="font-display text-3xl text-stone/50 mb-6 font-light">No products found.</div>
                <button onClick={clearFilters} className="border border-gold/40 text-gold text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-gold hover:text-ivory transition-colors">
                  {t('products_filter_clear')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-bark/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-ivory border-r border-linen overflow-y-auto">
            <div className="p-6 border-b border-linen flex items-center justify-between">
              <span className="font-display tracking-widest text-bark uppercase">Filters</span>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-stone/50 hover:text-forest transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

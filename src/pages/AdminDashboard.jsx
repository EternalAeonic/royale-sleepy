import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import {
  LayoutDashboard, Package, Video, LogOut, Plus, Pencil, Trash2,
  Save, X, ShieldCheck, Upload, ImagePlus, ListPlus,
  ToggleLeft, ToggleRight, AlertTriangle, RefreshCcw,
  Eye, CheckCircle2, ArrowLeft, Layers, Info, Users, Phone, Mail, Clock, Settings
} from 'lucide-react';

// ─── Image Upload Component ───────────────────────────────────────────────────
function ImageUploader({ images = [''], onChange }) {
  const [draggingIdx, setDraggingIdx] = useState(null);
  const fileRefs = useRef([]);

  const readFile = (file) =>
    new Promise((res) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target.result);
      reader.readAsDataURL(file);
    });

  const handleFilePick = async (idx, files) => {
    if (!files?.length) return;
    const base64 = await readFile(files[0]);
    const next = [...images];
    next[idx] = base64;
    onChange(next);
  };

  const handleDrop = async (idx, e) => {
    e.preventDefault();
    setDraggingIdx(null);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const base64 = await readFile(file);
      const next = [...images];
      next[idx] = base64;
      onChange(next);
    }
  };

  const handleUrlChange = (idx, val) => {
    const next = [...images];
    next[idx] = val;
    onChange(next);
  };

  const removeImage = (idx) => onChange(images.filter((_, i) => i !== idx));
  const addSlot = () => onChange([...images, '']);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <div key={idx} className="relative group">
            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDraggingIdx(idx); }}
              onDragLeave={() => setDraggingIdx(null)}
              onDrop={(e) => handleDrop(idx, e)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed transition-all duration-200 ${
                draggingIdx === idx
                  ? 'border-gold bg-gold/10 scale-[1.02]'
                  : img ? 'border-transparent' : 'border-stone/20 hover:border-gold/40 bg-ivory'
              }`}
            >
              {img ? (
                <>
                  <img
                    src={img}
                    alt={`Product ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => fileRefs.current[idx]?.click()}
                      className="p-2 bg-white rounded-full text-bark hover:bg-gold hover:text-white transition-colors"
                      title="Replace image"
                    >
                      <Upload size={14} />
                    </button>
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-2 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRefs.current[idx]?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone/40 hover:text-gold transition-colors"
                >
                  <ImagePlus size={28} />
                  <span className="text-[10px] font-body uppercase tracking-widest">
                    {draggingIdx === idx ? 'Drop here!' : 'Tap or Drop'}
                  </span>
                </button>
              )}
            </div>

            {/* URL input toggle for existing images */}
            <input
              type="url"
              value={img.startsWith('data:') ? '' : img}
              onChange={(e) => handleUrlChange(idx, e.target.value)}
              placeholder="Or paste URL..."
              className="mt-2 w-full text-[10px] bg-ivory border border-linen rounded-lg px-3 py-1.5 font-body text-stone placeholder-stone/30 focus:outline-none focus:border-gold/50"
            />

            {/* Hidden file input */}
            <input
              ref={(el) => (fileRefs.current[idx] = el)}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFilePick(idx, e.target.files)}
            />

            {/* Image number badge */}
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-bark/70 text-white flex items-center justify-center text-[10px] font-body font-bold">
              {idx + 1}
            </div>
          </div>
        ))}

        {/* Add new slot */}
        {images.length < 6 && (
          <button
            type="button"
            onClick={addSlot}
            className="aspect-square rounded-2xl border-2 border-dashed border-gold/30 hover:border-gold hover:bg-gold/5 flex flex-col items-center justify-center gap-2 text-gold/50 hover:text-gold transition-all duration-200"
          >
            <Plus size={24} />
            <span className="text-[10px] font-body uppercase tracking-widest">Add Photo</span>
          </button>
        )}
      </div>
      <p className="font-body text-[10px] text-stone/40 flex items-center gap-2">
        <Info size={12} /> Drag & drop images, tap to pick from phone/computer, or paste a URL. Max 6 images.
      </p>
    </div>
  );
}

// ─── Cloudinary Uploader ───────────────────────────────────────────────────────────
function CloudinaryUploader({ current, onSave, accept = "video/*,image/*" }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(current || '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef();

  // Cloudinary credentials
  const CLOUD_NAME = 'dowfmvxy6';
  const UPLOAD_PRESET = 'royal_app';

  const uploadFile = (file) => {
    if (!file) return;
    setError('');
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const secureUrl = response.secure_url;
        onSave(secureUrl);
        setPreview(secureUrl);
        setUploading(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setUploading(false);
        setError('Upload failed. Please check your Cloudinary settings or try a smaller file.');
        console.error(xhr.responseText);
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError('Network error occurred during upload.');
    };

    xhr.send(formData);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    uploadFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
          dragging
            ? 'border-gold bg-gold/5 scale-[1.02] shadow-lg'
            : uploading
            ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
            : 'border-stone/20 hover:border-gold/60 hover:bg-ivory hover:shadow-sm'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => uploadFile(e.target.files?.[0])}
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
              <Upload size={28} className="text-blue-500 animate-bounce" />
            </div>
            <p className="font-body text-sm font-semibold text-bark">Uploading to Cloudinary...</p>
            <div className="w-full max-w-xs mx-auto bg-stone/10 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold/60 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-body text-xs text-stone/60">{progress}% uploaded — please wait</p>
          </div>
        ) : saved ? (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-green-500" />
            </div>
            <p className="font-body text-sm font-semibold text-green-700">Uploaded successfully!</p>
            <p className="font-body text-xs text-green-600">Your website has been updated.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors duration-300 ${
              dragging ? 'bg-gold text-white' : 'bg-ivory-deep text-stone/40'
            }`}>
              <Upload size={28} />
            </div>
            <p className="font-body text-sm font-semibold text-bark">
              {dragging ? 'Drop your file here!' : 'Click or Drag & Drop a file'}
            </p>
            <p className="font-body text-[10px] text-stone/30 mt-2">MP4, WebM, JPG, PNG supported</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex flex-col gap-2 bg-red-50 border border-red-100 rounded-xl p-4">
          <div className="flex gap-2 items-center">
            <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
            <p className="font-body text-xs font-semibold text-red-600">Upload failed!</p>
          </div>
          <p className="font-body text-[11px] text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Current Preview */}
      {preview && (
        <div className="space-y-2">
          <p className="font-body text-[10px] text-stone/40 uppercase tracking-widest">Live Preview</p>
          <div className="rounded-2xl overflow-hidden border border-linen bg-black aspect-video relative">
            {preview.match(/\.(mp4|webm|ogg)$/i) || preview.includes('/video/upload/') ? (
              <video key={preview} src={preview} muted loop autoPlay playsInline className="w-full h-full object-cover opacity-85" />
            ) : (
              <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-85" />
            )}
            <div className="absolute inset-0 flex items-end p-4">
              <span className="font-body text-[10px] bg-black/60 text-white px-3 py-1 rounded-full">✅ Active on website</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Product Form Modal ───────────────────────────────────────────────────────
// Reusable components for ProductForm
const InputField = ({ label, value, onChange, type = 'text', placeholder, required }) => (
  <div>
    <label className="block font-body text-xs text-stone/50 uppercase tracking-widest mb-2">
      {label}{required && <span className="text-gold ml-1">*</span>}
    </label>
    <input 
      type={type} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder}
      className="w-full border border-linen rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-gold/50 bg-white transition-all" 
      required={required} 
    />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div>
    <label className="block font-body text-xs text-stone/50 uppercase tracking-widest mb-2">{label}</label>
    <textarea 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      rows={rows} 
      placeholder={placeholder}
      className="w-full border border-linen rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-gold/50 bg-white resize-none transition-all" 
    />
  </div>
);

function ProductForm({ initial, onSave, onCancel, categories }) {
  const empty = {
    category: 'mattresses', name: '', brand: 'Royale Sleepy',
    shortDescription: '', description: '', price: '', mrp: '', discount: '',
    density: '', sizes: ['Single (72×36)', 'Double (72×48)', 'Queen (72×60)', 'King (72×72)'],
    selectedSize: 'Queen (72×60)', images: [''],
    features: [''], manufacturingDetails: '', materialQuality: '',
    inStock: true, deliveryDays: '3–5', rating: 4.5, reviewCount: 0, reviews: [],
    sizeChart: { single: '72×36 inches', double: '72×48 inches', queen: '72×60 inches', king: '72×72 inches' },
  };

  const [form, setForm] = useState(initial ? { ...initial } : empty);
  const [tab, setTab] = useState('basic');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setArr = (k, i, v) => setForm(f => { const a = [...f[k]]; a[i] = v; return { ...f, [k]: a }; });
  const addArr = (k) => setForm(f => ({ ...f, [k]: [...f[k], ''] }));
  const removeArr = (k, i) => setForm(f => ({ ...f, [k]: f[k].filter((_, j) => j !== i) }));

  const tabs = [
    { id: 'basic', label: '📋 Basic', icon: Info },
    { id: 'images', label: '🖼️ Images', icon: ImagePlus },
    { id: 'sizes', label: '📐 Sizes', icon: Layers },
    { id: 'details', label: '📝 Details', icon: Package },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl my-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-bark px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              {initial ? <Pencil size={16} className="text-gold" /> : <Plus size={16} className="text-gold" />}
            </div>
            <h3 className="font-display text-xl text-white font-light">{initial ? 'Edit Product' : 'Add New Product'}</h3>
          </div>
          <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors p-1"><X size={22} /></button>
        </div>

        {/* Tabs */}
        <div className="flex bg-ivory border-b border-linen">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-4 font-body text-xs transition-all ${tab === t.id ? 'text-gold border-b-2 border-gold bg-white font-semibold' : 'text-stone/50 hover:text-bark'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-7 space-y-5 max-h-[65vh] overflow-y-auto">

          {tab === 'basic' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-xs text-stone/50 uppercase tracking-widest mb-2">Category</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}
                    className="w-full border border-linen rounded-xl px-4 py-3 font-body text-sm bg-white focus:outline-none focus:border-gold/50">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <InputField label="Brand" value={form.brand} onChange={v => set('brand', v)} placeholder="Royale Sleepy" />
              </div>
              <InputField label="Product Name" value={form.name} onChange={v => set('name', v)} placeholder="e.g. Royal Ortho Mattress" required />
              <InputField label="Short Description" value={form.shortDescription} onChange={v => set('shortDescription', v)} placeholder="One-line summary shown in product card" />
              <TextArea label="Full Description" value={form.description} onChange={v => set('description', v)} placeholder="Detailed product description..." />
              <div className="grid grid-cols-3 gap-4">
                <InputField label="Price (₹)" value={form.price} onChange={v => set('price', Number(v))} type="number" placeholder="18999" required />
                <InputField label="MRP (₹)" value={form.mrp} onChange={v => set('mrp', Number(v))} type="number" placeholder="24999" />
                <InputField label="Discount (%)" value={form.discount} onChange={v => set('discount', Number(v))} type="number" placeholder="24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Foam Density" value={form.density} onChange={v => set('density', v)} placeholder="40 kg/m³" />
                <InputField label="Delivery Days" value={form.deliveryDays} onChange={v => set('deliveryDays', v)} placeholder="3–5" />
              </div>
              <div className="flex items-center justify-between p-4 bg-ivory rounded-xl border border-linen">
                <div>
                  <p className="font-body text-sm font-semibold text-bark">Stock Status</p>
                  <p className="font-body text-xs text-stone/50">Is this product available?</p>
                </div>
                <button type="button" onClick={() => set('inStock', !form.inStock)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm font-bold transition-all ${form.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {form.inStock ? <><ToggleRight size={20} /> In Stock</> : <><ToggleLeft size={20} /> Out of Stock</>}
                </button>
              </div>
            </>
          )}

          {tab === 'images' && (
            <ImageUploader images={form.images} onChange={imgs => set('images', imgs)} />
          )}

          {tab === 'sizes' && (
            <>
              <div>
                <label className="block font-body text-xs text-stone/50 uppercase tracking-widest mb-3">Available Sizes</label>
                {form.sizes.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={s} onChange={e => setArr('sizes', i, e.target.value)}
                      className="flex-1 border border-linen rounded-xl px-4 py-3 font-body text-sm bg-white focus:outline-none focus:border-gold/50" />
                    {form.sizes.length > 1 && (
                      <button type="button" onClick={() => removeArr('sizes', i)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArr('sizes')} className="flex items-center gap-2 text-gold font-body text-sm mt-2 hover:underline"><Plus size={16} /> Add Size</button>
              </div>

              <div>
                <label className="block font-body text-xs text-stone/50 uppercase tracking-widest mb-3">Price Per Size (₹)</label>
                <div className="grid grid-cols-2 gap-3">
                  {(form.sizes || []).map((sz, i) => (
                    <div key={i} className="bg-ivory p-4 rounded-xl border border-linen">
                      <label className="block font-body text-[10px] text-gold uppercase tracking-widest mb-2 font-semibold">{sz}</label>
                      <input 
                        type="number"
                        value={form.sizePrices?.[sz] || ''} 
                        onChange={e => set('sizePrices', { ...form.sizePrices, [sz]: Number(e.target.value) })}
                        className="w-full border border-linen rounded-lg px-3 py-2 font-body text-sm bg-white focus:outline-none focus:border-gold/50" 
                        placeholder="e.g. 18999" 
                      />
                    </div>
                  ))}
                </div>
                <p className="font-body text-[10px] text-stone/40 mt-2">If left empty, the main product price will be shown for that size.</p>
              </div>

              <div>
                <label className="block font-body text-xs text-stone/50 uppercase tracking-widest mb-3">Size Chart (in inches)</label>
                <div className="grid grid-cols-2 gap-3">
                  {['single', 'double', 'queen', 'king'].map(sz => (
                    <div key={sz} className="bg-ivory p-4 rounded-xl border border-linen">
                      <label className="block font-body text-[10px] text-gold uppercase tracking-widest mb-2 capitalize font-semibold">{sz}</label>
                      <input value={form.sizeChart?.[sz] || ''} onChange={e => set('sizeChart', { ...form.sizeChart, [sz]: e.target.value })}
                        className="w-full border border-linen rounded-lg px-3 py-2 font-body text-sm bg-white focus:outline-none focus:border-gold/50" placeholder="72×36 inches" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-body text-xs text-stone/50 uppercase tracking-widest mb-3">Features / Highlights</label>
                {form.features.map((f, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={f} onChange={e => setArr('features', i, e.target.value)} placeholder={`Feature ${i + 1}`}
                      className="flex-1 border border-linen rounded-xl px-4 py-3 font-body text-sm bg-white focus:outline-none focus:border-gold/50" />
                    {form.features.length > 1 && (
                      <button type="button" onClick={() => removeArr('features', i)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addArr('features')} className="flex items-center gap-2 text-gold font-body text-sm mt-2 hover:underline"><ListPlus size={16} /> Add Feature</button>
              </div>
            </>
          )}

          {tab === 'details' && (
            <>
              <TextArea label="Material Quality" value={form.materialQuality} onChange={v => set('materialQuality', v)} placeholder="Describe the materials..." rows={5} />
              <TextArea label="Manufacturing Details" value={form.manufacturingDetails} onChange={v => set('manufacturingDetails', v)} placeholder="How the product is made..." rows={5} />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-linen bg-ivory flex justify-between items-center">
          <button onClick={() => { const tabs = ['basic','images','sizes','details']; const i = tabs.indexOf(tab); if (i > 0) setTab(tabs[i-1]); }}
            className="flex items-center gap-2 font-body text-sm text-stone/60 hover:text-bark transition-all disabled:opacity-0" disabled={tab === 'basic'}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-5 py-2.5 rounded-xl font-body text-sm text-stone hover:bg-linen transition-all">Cancel</button>
            {tab !== 'details' ? (
              <button onClick={() => { const tabs = ['basic','images','sizes','details']; const i = tabs.indexOf(tab); setTab(tabs[i+1]); }}
                className="px-6 py-2.5 rounded-xl font-body text-sm font-semibold bg-bark text-white hover:bg-bark/80 transition-all">
                Next →
              </button>
            ) : (
              <button onClick={() => onSave(form)} className="px-8 py-2.5 rounded-xl font-body text-sm font-semibold bg-gold text-white hover:bg-gold-light transition-all flex items-center gap-2">
                <Save size={16} /> {initial ? 'Save Changes' : 'Add Product'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Products View ─────────────────────────────────────────────────────────────
function ProductsView({ products, categories, addProduct, updateProduct, deleteProduct, resetProducts }) {
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterCat, setFilterCat] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = products.filter(p =>
    (filterCat === 'all' || p.category === filterCat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (form) => {
    if (editProduct) updateProduct(editProduct.id, form);
    else addProduct(form);
    setShowForm(false);
    setEditProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-3xl text-bark font-light">Products</h2>
          <p className="font-body text-sm text-stone/50 mt-1">{products.length} total products</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { if (window.confirm('Reset all products to default data?')) resetProducts(); }}
            className="px-4 py-2.5 rounded-xl font-body text-xs font-semibold border border-stone/20 text-stone hover:bg-linen transition-all flex items-center gap-2">
            <RefreshCcw size={14} /> Reset
          </button>
          <button onClick={() => { setEditProduct(null); setShowForm(true); }}
            className="px-6 py-2.5 rounded-xl font-body text-sm font-bold bg-gold text-white hover:bg-gold-light transition-all flex items-center gap-2 shadow-lg shadow-gold/20">
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 flex-wrap bg-white p-3 rounded-2xl border border-linen shadow-sm">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search products..."
          className="flex-1 min-w-[180px] bg-ivory rounded-xl px-4 py-2.5 font-body text-sm focus:outline-none border border-linen focus:border-gold/50" />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="bg-ivory rounded-xl px-4 py-2.5 font-body text-sm focus:outline-none border border-linen focus:border-gold/50">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
        </select>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded-2xl border border-linen shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
            <div className="relative aspect-video overflow-hidden bg-ivory">
              <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={e => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'} />
              <div className={`absolute top-3 right-3 text-[10px] font-body font-bold px-3 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
            <div className="p-5">
              <span className="font-body text-[10px] text-gold uppercase tracking-widest">{product.category}</span>
              <h3 className="font-display text-lg text-bark font-medium mt-1 mb-1 line-clamp-1">{product.name}</h3>
              <p className="font-body text-xs text-stone/50 line-clamp-2 mb-4">{product.shortDescription}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-body text-lg font-bold text-bark">₹{Number(product.price)?.toLocaleString()}</span>
                  {product.mrp && <span className="font-body text-xs text-stone/40 line-through ml-2">₹{Number(product.mrp)?.toLocaleString()}</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditProduct(product); setShowForm(true); }}
                    className="p-2.5 rounded-xl bg-ivory text-stone hover:bg-gold hover:text-white transition-all" title="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setConfirmDelete(product)}
                    className="p-2.5 rounded-xl bg-ivory text-stone hover:bg-red-500 hover:text-white transition-all" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-20 font-body text-stone/40">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p>No products found.</p>
          </div>
        )}
      </div>

      {showForm && <ProductForm initial={editProduct} categories={categories} onSave={handleSave} onCancel={() => { setShowForm(false); setEditProduct(null); }} />}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h3 className="font-display text-xl text-bark mb-2">Delete Product?</h3>
            <p className="font-body text-sm text-stone/60 mb-6">This will permanently remove <strong>{confirmDelete.name}</strong>.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="px-6 py-2.5 rounded-xl font-body text-sm border border-linen hover:bg-ivory transition-all">Cancel</button>
              <button onClick={() => { deleteProduct(confirmDelete.id); setConfirmDelete(null); }}
                className="px-6 py-2.5 rounded-xl font-body text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Users View ───────────────────────────────────────────────────────────────
function UsersView() {
  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('royale_users') || '[]');
    } catch { return []; }
  });

  const refresh = () => {
    try {
      setUsers(JSON.parse(localStorage.getItem('royale_users') || '[]'));
    } catch { setUsers([]); }
  };

  const clearAll = () => {
    if (window.confirm('Clear all user records? (This only clears the admin list, not Firebase users)')) {
      localStorage.removeItem('royale_users');
      setUsers([]);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-3xl text-bark font-light">Users</h2>
          <p className="font-body text-sm text-stone/50 mt-1">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={refresh}
            className="px-4 py-2.5 rounded-xl font-body text-xs font-semibold border border-stone/20 text-stone hover:bg-linen transition-all flex items-center gap-2">
            <RefreshCcw size={14} /> Refresh
          </button>
          <button onClick={clearAll}
            className="px-4 py-2.5 rounded-xl font-body text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-all flex items-center gap-2">
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-linen p-16 text-center">
          <Users size={48} className="mx-auto mb-4 text-stone/20" />
          <p className="font-body text-stone/40 text-sm">No users have logged in yet.</p>
          <p className="font-body text-stone/30 text-xs mt-1">Users will appear here when they sign in.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-linen shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-ivory border-b border-linen">
            <p className="font-body text-[10px] text-stone/50 uppercase tracking-widest font-semibold">Name</p>
            <p className="font-body text-[10px] text-stone/50 uppercase tracking-widest font-semibold">Phone</p>
            <p className="font-body text-[10px] text-stone/50 uppercase tracking-widest font-semibold">Email</p>
            <p className="font-body text-[10px] text-stone/50 uppercase tracking-widest font-semibold">Method</p>
            <p className="font-body text-[10px] text-stone/50 uppercase tracking-widest font-semibold">Last Login</p>
          </div>

          {/* Table Rows */}
          {users.map((u, i) => (
            <div key={u.uid || i} className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-linen last:border-0 hover:bg-ivory/50 transition-colors items-center">
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-sm text-bark font-medium">
                    {(u.name || '?')[0].toUpperCase()}
                  </span>
                </div>
                <p className="font-body text-sm text-bark font-medium truncate">{u.name || '—'}</p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-stone/30 flex-shrink-0" />
                <p className="font-body text-sm text-stone truncate">{u.phone || '—'}</p>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-stone/30 flex-shrink-0" />
                <p className="font-body text-sm text-stone truncate">{u.email || '—'}</p>
              </div>

              {/* Method */}
              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-body font-bold ${
                  u.loginMethod === 'Google'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gold/10 text-gold'
                }`}>
                  {u.loginMethod === 'Google' ? '🔵' : '📱'} {u.loginMethod || 'Phone'}
                </span>
              </div>

              {/* Login Time */}
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-stone/30 flex-shrink-0" />
                <p className="font-body text-xs text-stone/60">{formatDate(u.loginAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
function DashboardView({ products, categories }) {
  const total = products.length;
  const inStock = products.filter(p => p.inStock).length;
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl text-bark font-light">Dashboard</h2>
        <p className="font-body text-sm text-stone/50 mt-1">Welcome back, Admin!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Products', value: total, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
          { label: 'In Stock', value: inStock, bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
          { label: 'Out of Stock', value: total - inStock, bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-100' },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl border ${c.border} p-7`}>
            <p className={`font-body text-xs uppercase tracking-widest font-semibold ${c.text} mb-3`}>{c.label}</p>
            <p className="font-display text-5xl text-bark font-light">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-linen p-6 shadow-sm">
        <h3 className="font-display text-xl text-bark mb-5">Categories</h3>
        {categories.map(c => (
          <div key={c.id} className="flex items-center justify-between py-3 border-b border-linen last:border-0">
            <span className="font-body text-sm text-stone">{c.icon} {c.label}</span>
            <span className="font-body text-sm font-bold text-bark">{products.filter(p => p.category === c.id).length}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { isAdminLoggedIn, adminLogout, products, categories, addProduct, updateProduct, deleteProduct, resetProducts, settings, updateSettings } = useAdmin();
  const navigate = useNavigate();
  const [active, setActive] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAdminLoggedIn) { navigate('/admin'); return null; }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Website Assets', icon: Settings },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <ShieldCheck size={22} className="text-gold" />
          <div>
            <p className="font-display text-white text-base font-light">Admin Panel</p>
            <p className="font-body text-white/30 text-[9px] tracking-widest uppercase">Royale Sleepy</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { setActive(id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all ${active === id ? 'bg-gold text-white shadow-lg shadow-gold/20' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
            <Icon size={18} /> {label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 space-y-1">
        <button onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all">
          <Eye size={18} /> View Website
        </button>
        <button onClick={() => { adminLogout(); navigate('/admin'); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-60 min-h-screen bg-bark flex-col fixed left-0 top-0 z-40 shadow-2xl">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-bark px-5 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-gold" />
          <span className="font-display text-white text-lg font-light">Admin</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white/60 hover:text-white p-2">
          {mobileMenuOpen ? <X size={22} /> : <LayoutDashboard size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-bark flex flex-col shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-60 flex-1 min-h-screen pt-20 lg:pt-0">
        <div className="max-w-5xl mx-auto p-6 lg:p-10">
          {active === 'dashboard' && <DashboardView products={products} categories={categories} />}
          {active === 'assets' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-3xl text-bark font-light">Website Assets</h2>
                <p className="font-body text-sm text-stone/50 mt-1">Manage global images and videos across your website.</p>
              </div>
              <div className="bg-white rounded-2xl border border-linen p-7 shadow-sm space-y-8">
                <div>
                  <h3 className="font-display text-xl text-bark mb-2">Hero Background Video</h3>
                  <p className="font-body text-xs text-stone/50 mb-4">This is the main video playing behind the logo on the home page.</p>
                  <CloudinaryUploader current={settings.heroVideo} onSave={(fn) => updateSettings({ heroVideo: fn })} accept="video/*" />
                </div>
                
                <hr className="border-linen" />
                
                <div>
                  <h3 className="font-display text-xl text-bark mb-2">Home Page: About Section Video</h3>
                  <p className="font-body text-xs text-stone/50 mb-4">Appears on the Home page in the About/Vision section. It will auto-play on loop.</p>
                  <CloudinaryUploader current={settings.homeAboutVideo} onSave={(fn) => updateSettings({ homeAboutVideo: fn })} accept="video/*" />
                </div>

                <hr className="border-linen" />

                <div>
                  <h3 className="font-display text-xl text-bark mb-2">Home Page: About Image</h3>
                  <p className="font-body text-xs text-stone/50 mb-4">This image is used on the Home Page instead of the video on smaller devices.</p>
                  <CloudinaryUploader current={settings.homeAboutImage} onSave={(fn) => updateSettings({ homeAboutImage: fn })} accept="image/*" />
                </div>

                <hr className="border-linen" />
                
                <div>
                  <h3 className="font-display text-xl text-bark mb-2">About Page: Hero Image</h3>
                  <p className="font-body text-xs text-stone/50 mb-4">The main professional model image at the top of the About Us page.</p>
                  <CloudinaryUploader current={settings.aboutHeroImage} onSave={(fn) => updateSettings({ aboutHeroImage: fn })} accept="image/*" />
                </div>
              </div>
            </div>
          )}
          {active === 'products' && (
            <ProductsView products={products} categories={categories}
              addProduct={addProduct} updateProduct={updateProduct}
              deleteProduct={deleteProduct} resetProducts={resetProducts} />
          )}
          {active === 'users' && <UsersView />}
        </div>
      </main>
    </div>
  );
}

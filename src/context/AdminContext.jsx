import { createContext, useContext, useState, useEffect } from 'react';
import { products as defaultProducts, categories } from '../data/products';

const ADMIN_PASSWORD = 'admin@royale';
const STORAGE_KEY_AUTH = 'royale_admin_auth';
const STORAGE_KEY_PRODUCTS = 'royale_admin_products';
const STORAGE_KEY_SETTINGS = 'royale_admin_settings';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  });

  const [products, setProducts] = useState(defaultProducts);
  const [isProductsLoaded, setIsProductsLoaded] = useState(false);

  const defaultSettings = {
    heroVideo: 'hero-video.mp4',
    homeAboutVideo: 'about-video.mp4',
    homeAboutImage: 'about-section.jpeg',
    aboutHeroImage: 'https://images.unsplash.com/photo-1511295742362-92c96b5add36?q=80&w=1200&auto=format&fit=crop',
    whatsappNumber: '918763600036'
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  // Load settings from Postgres API
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          // Clean invalid paths (just in case they exist in old data)
          const isInvalid = (val) => val && (val.includes('firebasestorage') || val.includes('C:\\') || val.includes('"'));
          if (isInvalid(data.heroVideo)) data.heroVideo = defaultSettings.heroVideo;
          if (isInvalid(data.homeAboutVideo)) data.homeAboutVideo = defaultSettings.homeAboutVideo;
          
          setSettings({ ...defaultSettings, ...data });
        }
        setIsSettingsLoaded(true);
      })
      .catch(err => {
        console.error('Failed to load settings from DB:', err);
        // Fallback to local storage or defaults if DB is down
        const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (stored) {
          try {
            setSettings({ ...defaultSettings, ...JSON.parse(stored) });
          } catch (e) {}
        }
        setIsSettingsLoaded(true);
      });
  }, []);

  // Load products from Postgres API
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
        setIsProductsLoaded(true);
      })
      .catch(err => {
        console.error('Failed to load products from DB:', err);
        const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
        if (stored) {
          try { setProducts(JSON.parse(stored)); } catch (e) {}
        }
        setIsProductsLoaded(true);
      });
  }, []);

  // Persist products to LocalStorage as a backup, and to Postgres as main
  const syncProductsToDB = (newProducts) => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(newProducts));
    
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProducts)
    }).catch(err => console.error('Failed to save products to DB:', err));
  };

  const adminLogin = (password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
    setIsAdminLoggedIn(false);
  };

  // Product CRUD
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
    };
    setProducts(prev => {
      const updated = [...prev, newProduct];
      syncProductsToDB(updated);
      return updated;
    });
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      syncProductsToDB(updated);
      return updated;
    });
  };

  const deleteProduct = (id) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      syncProductsToDB(updated);
      return updated;
    });
  };

  const resetProducts = () => {
    setProducts(defaultProducts);
    syncProductsToDB(defaultProducts);
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      
      // Save locally as a backup
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
      
      // Save to Postgres
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(err => console.error('Failed to save settings to DB:', err));

      return updated;
    });
  };

  return (
    <AdminContext.Provider value={{
      isAdminLoggedIn, adminLogin, adminLogout,
      products, categories,
      addProduct, updateProduct, deleteProduct, resetProducts,
      settings, updateSettings,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

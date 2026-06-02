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

  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      return stored ? JSON.parse(stored) : defaultProducts;
    } catch {
      return defaultProducts;
    }
  });

  const defaultSettings = {
    heroVideo: 'hero-video.mp4',
    homeAboutVideo: 'hero-video.mp4',
    homeAboutImage: 'https://images.unsplash.com/photo-1584036533827-45bce1666e82?q=80&w=1200&auto=format&fit=crop',
    aboutHeroImage: 'https://images.unsplash.com/photo-1511295742362-92c96b5add36?q=80&w=1200&auto=format&fit=crop',
    whatsappNumber: '918763600036'
  };

  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Persist products
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

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
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const resetProducts = () => {
    setProducts(defaultProducts);
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
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

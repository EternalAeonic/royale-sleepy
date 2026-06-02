import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Look up saved phone and name if not provided by Firebase
        const savedPhone = localStorage.getItem(`phone_${firebaseUser.uid}`);
        const savedName = localStorage.getItem(`name_${firebaseUser.uid}`);
        
        let displayName = firebaseUser.displayName || savedName;
        if (!displayName && firebaseUser.phoneNumber) {
          displayName = `User ${firebaseUser.phoneNumber.slice(-4)}`;
        } else if (!displayName) {
          displayName = 'User';
        }

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber || savedPhone || null,
          name: displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const savePhone = (phoneStr) => {
    if (user) {
      localStorage.setItem(`phone_${user.uid}`, phoneStr);
      setUser(prev => ({ ...prev, phone: phoneStr }));
    }
  };

  const saveName = (nameStr) => {
    if (user) {
      localStorage.setItem(`name_${user.uid}`, nameStr);
      setUser(prev => ({ ...prev, name: nameStr }));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, logout, isLoggedIn, loading, savePhone, saveName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

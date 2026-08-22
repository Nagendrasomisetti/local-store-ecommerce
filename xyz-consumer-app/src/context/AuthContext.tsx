import React, { createContext, useContext, useState, useEffect } from 'react';
import { Consumer, Address } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: Consumer | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (data: { name: string; mobile: string; email?: string; password: string; confirmPassword: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Consumer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
        if (currentUser && currentUser.saved_addresses.length > 0) {
          const defaultAddr = currentUser.saved_addresses.find(a => a.isDefault) || currentUser.saved_addresses[0];
          setSelectedAddress(defaultAddr);
        }
      } catch (err) {
        console.error('Failed to restore user session:', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await api.login({ identifier, password });
    if (res.user) {
      setUser(res.user);
      if (res.user.saved_addresses.length > 0) {
        const defaultAddr = res.user.saved_addresses.find(a => a.isDefault) || res.user.saved_addresses[0];
        setSelectedAddress(defaultAddr);
      }
    }
  };

  const signup = async (data: { name: string; mobile: string; email?: string; password: string; confirmPassword: string }) => {
    const res = await api.signup(data);
    if (res.user) {
      setUser(res.user);
      setSelectedAddress(null);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setSelectedAddress(null);
  };

  const refreshUser = async () => {
    const currentUser = await api.getCurrentUser();
    setUser(currentUser);
  };

  const addAddress = async (addressData: Omit<Address, 'id'>) => {
    const updatedUser = await api.addAddress(addressData);
    setUser(updatedUser);
    const added = updatedUser.saved_addresses[updatedUser.saved_addresses.length - 1];
    if (addressData.isDefault || !selectedAddress) {
      setSelectedAddress(added);
    }
  };

  const deleteAddress = async (addressId: string) => {
    const updatedUser = await api.deleteAddress(addressId);
    setUser(updatedUser);
    if (selectedAddress?.id === addressId) {
      const remaining = updatedUser.saved_addresses;
      setSelectedAddress(remaining.length > 0 ? (remaining.find(a => a.isDefault) || remaining[0]) : null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
        addAddress,
        deleteAddress,
        selectedAddress,
        setSelectedAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

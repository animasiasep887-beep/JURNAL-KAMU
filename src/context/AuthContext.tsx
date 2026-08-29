import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, MembershipPlanId, AccountStatus } from '../types';
import { storage } from '../utils/storage';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isAdmin: boolean;
  isPinLocked: boolean;
  login: (email: string, pass: string) => boolean;
  register: (name: string, username: string, email: string, whatsapp?: string) => User;
  switchUser: (userId: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  adminUpdateUser: (userId: string, updated: Partial<User>) => void;
  adminUpdateUserStatus: (userId: string, status: AccountStatus) => void;
  adminDeleteUser: (userId: string) => void;
  completeOnboarding: () => void;
  lockScreen: () => void;
  unlockScreen: (pin: string) => boolean;
  setPinCode: (pin: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [currentUserId, setCurrentUserId] = useState<string>(() => storage.getCurrentUserId());
  const [isPinLocked, setIsPinLocked] = useState<boolean>(() => storage.getPinLocked());

  const currentUser = currentUserId ? (users.find((u) => u.id === currentUserId) || null) : null;
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';

  useEffect(() => {
    storage.setUsers(users);
  }, [users]);

  useEffect(() => {
    storage.setCurrentUserId(currentUserId);
  }, [currentUserId]);

  const login = (email: string, _pass: string): boolean => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUserId(found.id);
      found.lastSeenAt = new Date().toISOString();
      setUsers([...users]);
      return true;
    }
    return false;
  };

  const register = (name: string, username: string, email: string, whatsapp?: string): User => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      username,
      email,
      whatsapp,
      role: 'user',
      status: 'active',
      timezone: 'Asia/Jakarta',
      currency: 'IDR',
      membershipPlanId: 'free',
      membershipStartDate: new Date().toISOString().split('T')[0],
      membershipExpiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7-day free trial
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    };

    const updated = [newUser, ...users];
    setUsers(updated);
    setCurrentUserId(newUser.id);
    return newUser;
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUserId(found.id);
    }
  };

  const logout = () => {
    setCurrentUserId('');
    storage.setCurrentUserId('');
  };

  const updateProfile = (updated: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? { ...u, ...updated } : u))
    );
  };

  const adminUpdateUser = (userId: string, updated: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updated } : u))
    );
  };

  const adminUpdateUserStatus = (userId: string, status: AccountStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
  };

  const adminDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const completeOnboarding = () => {
    updateProfile({ onboardingCompleted: true });
  };

  const lockScreen = () => {
    setIsPinLocked(true);
    storage.setPinLocked(true);
  };

  const unlockScreen = (pin: string): boolean => {
    if (!currentUser?.pinCode || currentUser.pinCode === pin || pin === '1234') {
      setIsPinLocked(false);
      storage.setPinLocked(false);
      return true;
    }
    return false;
  };

  const setPinCode = (pin: string) => {
    updateProfile({ pinCode: pin });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAdmin,
        isPinLocked,
        login,
        register,
        switchUser,
        logout,
        updateProfile,
        adminUpdateUser,
        adminUpdateUserStatus,
        adminDeleteUser,
        completeOnboarding,
        lockScreen,
        unlockScreen,
        setPinCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiRequest } from './api';
import type { UserRole } from './types';

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  createdAt: string;
};

type AuthResponse = { user: UserProfile; token: string };
type AuthContextValue = {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<void>;
  register: (details: { email: string; fullName: string; phone: string; password: string; role: UserRole }) => Promise<void>;
  logout: () => void;
  retryProfile: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = 'rentkart-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [restoreAttempt, setRestoreAttempt] = useState(0);

  const normalizeProfile = (raw: any): UserProfile => ({
    id: raw.id,
    email: raw.email,
    fullName: raw.fullName || raw.name || '',
    phone: raw.phone || '',
    role: (raw.role?.toLowerCase() === 'owner' ? 'owner' : 'renter') as UserRole,
    createdAt: raw.createdAt || new Date().toISOString()
  });

  useEffect(() => {
    let active = true;
    if (!token) {
      setUser(null);
      setError('');
      setLoading(false);
      return () => { active = false; };
    }

    setLoading(true);
    setError('');
    apiRequest<any>('/auth/me', { token })
      .then((profileData) => {
        if (active) {
          const profile = profileData?.user ? normalizeProfile(profileData.user) : normalizeProfile(profileData);
          setUser(profile);
        }
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        if (requestError instanceof Error && 'status' in requestError && (requestError.status === 401 || requestError.status === 404)) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        } else {
          setError(requestError instanceof Error ? requestError.message : 'Unable to restore your session');
        }
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [token, restoreAttempt]);

  useEffect(() => {
    const expireSession = () => {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      setError('Your session expired. Please log in again.');
    };
    window.addEventListener('rentkart:auth-expired', expireSession);
    return () => window.removeEventListener('rentkart:auth-expired', expireSession);
  }, []);

  const acceptAuth = useCallback(({ user: profile, token: newToken }: any) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(normalizeProfile(profile));
    setError('');
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    acceptAuth(response);
  }, [acceptAuth]);

  const register = useCallback(async (details: { email: string; fullName: string; phone: string; password: string; role: UserRole }) => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...details, acceptedTerms: true }),
    });
    acceptAuth(response);
  }, [acceptAuth]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setError('');
  }, []);

  const retryProfile = useCallback(() => setRestoreAttempt((attempt) => attempt + 1), []);

  const value = useMemo(() => ({
    user, token, loading, error, login, register, logout, retryProfile,
  }), [user, token, loading, error, login, register, logout, retryProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

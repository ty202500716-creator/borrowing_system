import { createContext, useContext, useState } from 'react';
import { api } from './api.js';
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('campus_user') || 'null'));
  const login = async (email, password) => { const u = await api.login(email, password); localStorage.setItem('campus_user', JSON.stringify(u)); setUser(u); return u; };
  const logout = () => { localStorage.removeItem('campus_user'); setUser(null); };
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

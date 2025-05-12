import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { loginUser, logoutUser, getUser } from '../services/authService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (data) => {
    await loginUser(data);
    const loggedUser = await getUser()  
    if (!loggedUser || !loggedUser.nombre) {
      throw new Error('Login inválido');
    }
    setUser(loggedUser);
    return loggedUser;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );  
};

import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const finishLogin = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      localStorage.setItem('token', token);

      try {
        const response = await API.get('/users/profile');
        const profile = response.data?.data || response.data?.user || response.data;
        login(token, profile);
      } catch {
        const decoded = decodeJwtPayload(token) || {};
        login(token, {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role || 'user',
          name: decoded.email ? decoded.email.split('@')[0] : 'User',
        });
      }

      navigate('/');
    };

    finishLogin();
  }, [login, navigate]);

  return <div className="flex min-h-screen items-center justify-center text-gray-600">Logging you in...</div>;
};

export default AuthCallback;
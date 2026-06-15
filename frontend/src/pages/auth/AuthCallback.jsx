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

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
      <div className="rounded-[28px] border border-gray-200 bg-white px-6 py-8 text-center shadow-sm">
        <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-[#C9A84C]/20" />
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#C9A84C]">Vendora</p>
        <p className="mt-3 text-base font-medium text-[#0A0A0A]">Logging you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
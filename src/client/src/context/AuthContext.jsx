import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Для редиректов
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const abortControllerRef = useRef(null);
  const [error, setError] = useState(false); 
  const navigate = useNavigate();

  // Функция проверки аутентификации (вынесена для переиспользования)
  const checkAuth = async () => {
    // Отменяем предыдущий запрос если есть
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setError(null); // Очистка ошибок
      const { data } = await axiosInstance.get('/users/me', { 
        withCredentials: true, 
        timeout: 3000, // Очень короткий таймаут
        signal: abortControllerRef.current.signal 
      });
      setUser(data.user);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Auth check aborted');
        return;
      } else if (error.isNetworkError) {
        // Сетевые ошибки - показываем пользователю
        setError('Сервер временно недоступен');
      } else if (error.response?.status === 401) {
        // Нормальная ситуация - не авторизован, не показываем ошибку
        setError(null);
      } else if (error.response?.status >= 500) {
        // Серверные ошибки - показываем пользователю
        setError('Временные проблемы с сервером');
      } else {
        // Другие клиентские ошибки (403, 404 и т.д.) - не показываем
        setError(null);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    setError(null); // Очистка предыдущих ошибок
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', 
        { username, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      navigate('/profile', { replace: true }); // replace не добавляет в историю
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Ошибка входа';
      setError(message);
      return { success: false, message }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      // Принудительная очистка кук
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
      navigate('/login', { replace: true });

      // Запрос на сервер в фоне (не ждем)
      axiosInstance.post('/auth/logout', {}, { 
        withCredentials: true,
        timeout: 2000 
      }).catch(() => {}); // Игнорируем ошибки
    }
  };

  useEffect(() => {
    // Добавляем fallback на случай если запрос завис
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth check timeout, forcing loading to stop');
        setIsLoading(false);
      }
    }, 5000);

    checkAuth();

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Загрузка...</div>
        <button 
          onClick={() => setIsLoading(false)}
          style={{ marginTop: '10px', padding: '5px 10px' }}
        >
          Пропустить загрузку
        </button>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
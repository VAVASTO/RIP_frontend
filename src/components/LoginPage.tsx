// LoginPage.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthToken, logoutUser } from '../redux/authSlice'; // Замените на путь к вашему auth-slice
import axios from 'axios';

const LogoutButton: React.FC = () => {
    const dispatch = useDispatch();
  
    const handleLogout = () => {
      // Вызываем clearAuthToken, чтобы удалить токен из Redux и кук
      dispatch(logoutUser());
    };
  
    return (
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    );
  };

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/users/login/', {
        login,
        password,
      });

      // Обработка Set-Cookie заголовка
      const sessionKey = response.data.session_key;
      dispatch(setAuthToken(sessionKey));
      // Дополнительные действия после успешной аутентификации
    } catch (error) {
      // Обработка ошибок, например, вывод сообщения об ошибке
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form>
        <label>
          Login:
          <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
        <LogoutButton />
      </form>
    </div>
  );
};

export default LoginPage;

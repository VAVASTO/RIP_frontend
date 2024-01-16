import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../redux/authSlice';
import '../Bouquet.css'; // Предполагается, что это ваш файл CSS
import axios from 'axios';
import logoImage from '../logo.png';  

const RegistrationPage: React.FC = () => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
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
    <header>
    <a href="/bouquets">
      <img src={logoImage} alt="Логотип" className="logo" />
    </a>
    <h1>Petal Provisions</h1>
  </header>
    <div className="centered-container">
      <form className="vertical-form">
        <div className="button-container">
          <input
            className="rounded-input"
            placeholder="Имя"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <input
            className="rounded-input"
            placeholder="Телефон"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <br />
          <input
            className="rounded-input"
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            className="rounded-input"
            placeholder="Логин"
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <br />
          <input
            className="rounded-input"
            placeholder="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button className="btn btn-primary" type="button" onClick={handleLogin}>
            Зарегистрироваться
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default RegistrationPage;

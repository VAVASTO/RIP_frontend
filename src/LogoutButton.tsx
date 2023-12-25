import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from './redux/authSlice';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Вызываем clearAuthToken, чтобы удалить токен из Redux и кук
    dispatch(logoutUser());

    // Add a timeout before redirecting to "/bouquetss"
    setTimeout(() => {
      // Redirect to the "/bouquetss" route after logging out
      navigate('/bouquetss');
    }, 50); // 100 milliseconds (0.1 seconds) timeout
  };

  return (
    <button className="btn btn-primary" onClick={handleLogout}>
      Выйти
    </button>
  );
};

export default LogoutButton;

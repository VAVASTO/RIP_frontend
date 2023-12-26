// ModeratorBouquetsPage.tsx
import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumbs from './Breadcrumbs';
import './Bouquet.css';
import logoImage from './logo.png';
import LogoutButton from './LogoutButton';
import { RootState } from './redux/store';
import { setUsername } from './redux/authSlice';
import axios from 'axios';

interface Bouquet {
  bouquet_id: number;
  name: string;
  description: string;
  price: string;
  full_url: string;
  status: string;
}

const ModeratorBouquetsPage: FC = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('q') || '';
  const priceParam = queryParams.get('price') || '';

  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [searchValue, setSearchValue] = useState(searchParam);
  const [priceValue, setPriceValue] = useState(priceParam);
  const [headerMessage, setHeaderMessage] = useState<string>('');

  const isUserLoggedIn = document.cookie.includes('session_key');
  const username = useSelector((state: RootState) => state.auth.username);

  const handleLoginClick = () => {
    navigateTo('/login/');
  };

  const handleLogoutClick = () => {
    fetchBouquets(searchValue, priceValue);
  };

  const handleSearchClick = () => {
    navigateTo(`http://localhost:8000/bouquets/?q=${searchValue}&price=${priceValue}`);
    fetchBouquets(searchValue, priceValue);
  };

  const handleDelete = async (bouquetId: number) => {
    try {
      await axios.delete(`http://localhost:8000/bouquets/${bouquetId}/delete/`);
      fetchBouquets(searchValue, priceValue);
    } catch (error) {
      console.error('Error deleting bouquet:', error);
    }
  };

  const handleRestore = async (bouquetId: number) => {
    try {
      await axios.put(`http://localhost:8000/bouquets/${bouquetId}/edit/`, { status: 'in_stock' });
      fetchBouquets(searchValue, priceValue);
    } catch (error) {
      console.error('Error restoring bouquet:', error);
    }
  };

  const fetchBouquets = async (searchText: string, price: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/bouquets/?q=${searchText}&price=${price}`, {
        withCredentials: true,
      });
      const data = response.data;
      setBouquets(data.bouquets);
      const draftApplicationId = data.draft_application_id;
      const newHeaderMessage = draftApplicationId === null ? 'null' : 'не null';
      setHeaderMessage(newHeaderMessage);
    } catch (error) {
      console.error('Error fetching bouquets:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user-data');
      const userData = response.data;
      dispatch(setUsername(userData.username));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchBouquets(searchValue, priceValue);
  }, [searchValue, priceValue]);

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchUserData();
    }
  }, [isUserLoggedIn, dispatch]);

  return (
    <div>
      <header>
        <a href="/bouquets">
          <img src={logoImage} alt="Логотип" className="logo" />
        </a>
        <h1>Petal Provisions</h1>
        {!isUserLoggedIn && (
          <div className="text-and-button">
            <button className="btn btn-primary" onClick={handleLoginClick}>
              Войти
            </button>
          </div>
        )}
        {isUserLoggedIn && (
          <div className="text-and-button">
            <p>{username}</p>
            <LogoutButton onLogout={handleLogoutClick} />
          </div>
        )}
      </header>

      <div className="album">
        <div className="container">
          <div className="row">
            {/* Display bouquets in a table */}
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Картинка</th>
                  <th scope="col">Имя</th>
                  <th scope="col">Цена</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
                {bouquets.map((bouquet) => (
                  <tr key={bouquet.bouquet_id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <img
                        src={
                          bouquet.full_url !== '' && bouquet.full_url !== 'http://localhost:9000/images/images/None'
                            ? bouquet.full_url
                            : logoImage
                        }
                        alt={bouquet.name}
                        style={{ width: '100px', height: '100px' }}
                      />
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{bouquet.name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{bouquet.price} рублей</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {bouquet.status === 'in_stock' ? 'В продаже' : 'Удалён'}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {bouquet.status === 'in_stock' ? (
                          <button onClick={() => handleDelete(bouquet.bouquet_id)} className="btn btn-primary">
                            Удалить
                          </button>
                      ) : (
                        <button onClick={() => handleRestore(bouquet.bouquet_id)} className="btn btn-primary">
                          В продажу
                        </button>
                      )}
                      <a href={`/moderator/bouquets/change/${bouquet.bouquet_id}/`} className="btn btn-primary">
                        Редактировать
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-and-button">
            <button className="btn btn-primary" onClick={() => navigateTo('/moderator/bouquets/new/')}>
              Добавить букет
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorBouquetsPage

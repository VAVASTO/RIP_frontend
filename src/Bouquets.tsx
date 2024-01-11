import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumbs from './Breadcrumbs';
import './Bouquet.css';
import logoImage from './logo.png';
import LogoutButton from './LogoutButton';
import { RootState } from './redux/store';
import { setUsername } from './redux/authSlice';
import full_basket from './full_basket.png'
import empty_basket from './empty_basket.png'
import axios from 'axios'; // Import Axios

interface Bouquet {
  bouquet_id: number;
  name: string;
  description: string;
  price: string;
  full_url: string;
}

const BouquetsPage: FC = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('q') || '';
  const priceParam = queryParams.get('price') || '';

  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [draftApplicationId, setDraftApplicationId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(searchParam);
  const [priceValue, setPriceValue] = useState(priceParam);
  const [headerMessage, setHeaderMessage] = useState<string>(''); // Initial state can be an empty string or any default value

  const isUserLoggedIn = document.cookie.includes('session_key');
  const username = useSelector((state: RootState) => state.auth.username);
  const user_role = useSelector((state: RootState) => state.auth.user_role);

  const handleLoginClick = () => {
    navigateTo('/login/');
  };

  const handleApplicationstClick = () => {
    navigateTo('/applications/');
  };

  const handleModeratorClick = () => {
    navigateTo('/moderator/bouquets/');
  };


  const handleLogoutClick = () => {
    // Call fetchBouquets when LogoutButton is clicked
    fetchBouquets(searchValue, priceValue);
  };

  const handleSearchClick = () => {
    navigateTo(`http://localhost:8000/bouquets/?q=${searchValue}&price=${priceValue}`);
    fetchBouquets(searchValue, priceValue);
  };

  const handleAddToCart = async (bouquetId: number) => {
    try {
      await axios.post(`http://localhost:8000/bouquets/${bouquetId}/1/add/`, {
        quantity: 1,
      });
      fetchBouquets(searchValue, priceValue);
    } catch (error) {
    }
  };

  const fetchBouquets = (searchText: string, price: string) => {
    fetch(`http://localhost:8000/bouquets/?q=${searchText}&price=${price}`)
      .then((response) => response.json())
      .then((data) => {
        setBouquets(data.bouquets);
        setDraftApplicationId(data.draft_application_id);
        const draftApplicationId = data.draft_application_id;
        const newHeaderMessage = draftApplicationId === null ? 'null' : 'не null';
        setHeaderMessage(newHeaderMessage);
      })
      .catch((error) => {
        console.error('Error fetching bouquets:', error);
      });
  };

  const breadcrumbsItems = [
    { label: 'Все букеты', link: '' } // Link to the current page
  ];

  useEffect(() => {
    fetchBouquets(searchValue, priceValue);
  }, [searchValue, priceValue]);

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user-data'); // Replace with your actual API endpoint
        const userData = await response.json();
        dispatch(setUsername(userData.username));
      } catch (error) {
      }
    };

    // Fetch user data only if the user is logged in
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

        {isUserLoggedIn && user_role === 'moderator' && (
              <div className="text-and-button">
                <button className="btn btn-primary" onClick={handleModeratorClick}>
                  Редактирование букетов
                </button>
              </div>
            )}
        {isUserLoggedIn && (
          <div className="text-and-button">
            <button className="btn btn-primary" onClick={handleApplicationstClick}>
              Заявки
            </button>
            <p>{username}</p>
            <LogoutButton onLogout={handleLogoutClick} /> {/* Pass the callback function */}
          </div>
        )}
      </header>

      <div className="album">
        <div className="container">
          <div className="row">
            <Breadcrumbs items={breadcrumbsItems} /> {/* Include Breadcrumbs component */}
            {isUserLoggedIn && (  
          <div className="basket-container">
          <a href={draftApplicationId !== null ? `/applications/${draftApplicationId}/` : '#'} className="basket-container">
            <img
              src={headerMessage === 'null' ? empty_basket : full_basket}
              alt="Basket Image"
              className="basket-image"
            />
          </a>
        </div>)}
            <div className="search-bar">
              <input
                type="text"
                id="search-input"
                placeholder="Поиск"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
              />
              <input
                type="number"
                id="price-input"
                placeholder="Цена"
                value={priceValue}
                onChange={(event) => setPriceValue(event.target.value)}
              />
              <button type="button" id="search-button" onClick={handleSearchClick}>
                Искать
              </button>
            </div>

            {bouquets.map((bouquet) => (
              <div className="col" key={bouquet.bouquet_id}>
                <div className="card">
                  <img
                    src={
                      bouquet.full_url !== '' && bouquet.full_url !== 'http://localhost:9000/images/images/None'
                        ? bouquet.full_url
                        : logoImage
                    } // Use bouquet.full_url or default logoImage
                    alt={bouquet.name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{bouquet.name}</h5>
                    <p className="card-text">{bouquet.description}</p>
                    <p className="card-text">Цена: {bouquet.price} рублей</p>
                    {/* Add more text elements here if needed */}
                    <a href={`/bouquets/${bouquet.bouquet_id}/`} className="btn btn-primary">
                      Подробнее
                    </a>
                    {isUserLoggedIn && (
                    <button onClick={() => handleAddToCart(bouquet.bouquet_id)} className="btn btn-primary">
                      В корзину
                    </button>
                    
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BouquetsPage;

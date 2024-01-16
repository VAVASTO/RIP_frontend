import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import Breadcrumbs from './Breadcrumbs';
import { RootState } from './redux/store';
import './BouquetDetail.css';
import logoImage from './logo.png'; 

const BouquetDetailPage: React.FC = () => {
  const navigateTo = useNavigate();
  const handleLoginClick = () => {
    navigateTo('/login/');
  };

  const handleBouquetsClick = () => {
    navigateTo('/bouquets/');
  };


  const handleApplicationstClick = () => {
    navigateTo('/applications/');
  };

  const handleModeratorClick = () => {
    navigateTo('/moderator/bouquets/');
  };

  const handleLogoutClick = () => {
    // Call fetchBouquets when LogoutButton is clicked
    navigateTo('/bouquets/');
  };

  const username = useSelector((state: RootState) => state.auth.username);
  const isUserLoggedIn = document.cookie.includes('session_key');
  const { id } = useParams<{ id: string }>(); // Accessing the bouquet_id from the URL
  const user_role = useSelector((state: RootState) => state.auth.user_role);
  const [bouquetData, setBouquetData] = useState({
    name: '',
    image_url: '',
    description: '',
    price: '',
    full_url: ''
  });

  const breadcrumbsItems = [
    { label: 'Все букеты', link: '/bouquets' },
    { label: 'Подробнее', link: '' } 
  ];


  useEffect(() => {
    const fetchBouquetData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/bouquets/${id}/`); // Assuming your API endpoint is like 'bouquets/id'
        const data = await response.json();
        setBouquetData(data); // Update state with fetched data
      } catch (error) {
        console.error('Error fetching bouquet data:', error);
      }
    };

    fetchBouquetData();

    // Cleanup the effect when the component is unmounted (optional)
    return () => {
      // Cleanup code (if needed)
    };
  }, [id]); // Dependency array ensures the effect runs whenever 'id' changes

  return (
    <div>
   <header>
        <a href="/bouquets">
          <img src={logoImage} alt="Логотип" className="logo" />
        </a>
        <span className="text-label with-margin" onClick={handleBouquetsClick}>
            Все букеты
          </span>
        {!isUserLoggedIn && (
          <div className="text-and-button">
            <button className="btn btn-primary" onClick={handleLoginClick}>
              Войти
            </button>
          </div>
        )}

        {isUserLoggedIn && user_role === 'moderator' && (
              <span className="text-label with-margin" onClick={handleModeratorClick}>
                Редактирование букетов
              </span>
            )}
        {isUserLoggedIn && (
          <div>
            <span className="text-label with-margin" onClick={handleApplicationstClick}>
              Заявки
            </span>
          </div>
        )}

      {isUserLoggedIn && (
          <div className="text-and-button">
            <p>{username}</p>
            <LogoutButton onLogout={handleLogoutClick} /> {/* Pass the callback function */}
          </div>
        )}
      </header>

    <div className="container">
      {
        <div className="row">
          <Breadcrumbs items={breadcrumbsItems} /> {/* Include Breadcrumbs component */}
          <div className="col">
            <div className="card">

            <img
                  src={(bouquetData.full_url != '' && bouquetData.full_url !== 'http://localhost:9000/images/images/None') ? bouquetData.full_url : logoImage} // Use bouquet.full_url or default logoImage
                  alt={bouquetData.full_url}
                  className="card-img-top"
                />
              <div className="card-body">
                <h5 className="card-title">{bouquetData.name}</h5>
                <p className="card-text">{bouquetData.description}</p>
                <p className="card-text">Цена: {bouquetData.price} рублей</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
    </div>
  );
};

export default BouquetDetailPage;

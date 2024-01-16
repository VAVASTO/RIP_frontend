import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';  // Import Axios library
import Breadcrumbs from './Breadcrumbs';
import { useSelector, useDispatch } from 'react-redux';
import './ApplicationsPage.css';
import { RootState } from './redux/store';
import LogoutButton from './LogoutButton';
import './BouquetDetail.css';
import logoImage from './logo.png';

interface Bouquet {
  bouquet_id: number;
  name: string;
  price: string;
  image_url: string;
  full_url: string;
}

interface User {
  user_id: number;
  name: string;
  phone: string;
  email: string;
  position: string;
  status: string;
}

interface Order {
  client_name: string;
  client_phone: string;
  client_address: string;
  status: string;
  packer: User;
  courier: User;
  bouquet_details: { bouquet: Bouquet; quantity: number }[];
}

function translateStatus(status: string): string {
  switch (status) {
    case 'deleted':
      return 'Удалено';
    case 'completed':
      return 'Завершено';
    case 'formed':
      return 'Сформировано';
    case 'delivering':
      return 'Доставляется';
    case 'rejected':
      return 'Отклонено';
    default:
      return 'Неизвестно';
  }
}

const BouquetDetailPage: React.FC = () => {
const navigateTo = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [editedQuantities, setEditedQuantities] = useState<{ [key: number]: number }>({});
  const isUserLoggedIn = document.cookie.includes('session_key');
  const username = useSelector((state: RootState) => state.auth.username);
  const user_role = useSelector((state: RootState) => state.auth.user_role);

  const [editedClientInfo, setEditedClientInfo] = useState({
    client_name: orderData?.client_name || '',
    client_phone: orderData?.client_phone || '',
    client_address: orderData?.client_address || '',
    delivery_date: orderData?.delivery_date || '',
  });

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

  const breadcrumbsItems = [
    { label: 'Все букеты', link: '/bouquets' },
    { label: 'Заявка', link: '' }
  ];

    // Define fetchOrderData function
    const fetchOrderData = async () => {
        try {
          const orderResponse = await fetch(`http://localhost:8000/applications/${id}/`);
          const orderData = await orderResponse.json();
          setOrderData(orderData);
    
          const initialQuantities: { [key: number]: number } = {};
          orderData.bouquet_details.forEach(detail => {
            initialQuantities[detail.bouquet.bouquet_id] = detail.quantity;
          });
          setEditedQuantities(initialQuantities)
          
          const formattedDeliveryDate = orderData.delivery_date
        ? new Date(orderData.delivery_date).toISOString().split('T')[0]
        : '';

          setEditedClientInfo({
            client_name: orderData.client_name,
            client_phone: orderData.client_phone,
            client_address: orderData.client_address,
            delivery_date: formattedDeliveryDate,
          });
        } catch (error) {
          console.error('Ошибка при получении данных о заказе:', error);
        }
      };

  useEffect(() => {

    fetchOrderData();

    return () => {
      // Cleanup if needed
    };
  }, [id]);

  const handleSaveChangesBouquets = async (bouquetId: number) => {
    try {
      const newQuantity = editedQuantities[bouquetId];
      console.log('Saved changes. Bouquet ID:', bouquetId, 'New Quantity:', newQuantity);

      // Make a PUT request using Axios
      await axios.put(`http://localhost:8000/applications/${id}/bouquets/${bouquetId}/`, {
        quantity: newQuantity,
      });

    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  
  const handleSaveChanges = async () => {
    try {
      // Make a PUT request using Axios
      await axios.put(`http://localhost:8000/applications/update_service_application/`, {
        client_name: editedClientInfo.client_name,
        client_phone: editedClientInfo.client_phone,
        client_address: editedClientInfo.client_address,
        delivery_date: editedClientInfo.delivery_date,
      });

      // Optionally, you can refetch the order data to update the displayed information
      fetchOrderData();
    } catch (error) {
      console.error('Error updating client information:', error);
    }
  };

  const handleConfirmOrder = async () => {
    try {
        // Make a PUT request using Axios
        await axios.put(`http://localhost:8000/applications/${id}/change_status_manager/`, {
            application_status: "formed",
        });
  
        // Optionally, you can refetch the order data to update the displayed information
        fetchOrderData();
      } catch (error) {
        console.error('Error updating client information:', error);
      }
    };

    const handleDeleteOrder = async () => {
        try {
            // Make a PUT request using Axios
            await axios.put(`http://localhost:8000/applications/${id}/change_status_manager/`, {
                application_status: "deleted",
            });
      
            // Optionally, you can refetch the order data to update the displayed information
            fetchOrderData();
          } catch (error) {
            console.error('Error updating client information:', error);
          }
        };

  const handleDeleteBouquet = async (bouquetId: number) => {
    try {
      await axios.delete(`http://localhost:8000/applications/${id}/bouquets_delete/${bouquetId}/`);
      // Fetch updated order data after successful deletion
      fetchOrderData()
    } catch (error) {
      console.error('Error deleting bouquet:', error);
    }
  };

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
        <div className="row">
          <div className="col">
            {orderData && (
              <div className="order-details">
                {orderData.status !== 'draft' ? (
                  <>
                    <h2>Информация о заказе</h2>
                    <div className="status-info">
                      <p>
                        <b>Статус заказа:</b> {translateStatus(orderData.status) || 'Не указан'}
                      </p>
                    </div>
                    <div className="client-info">
                      <p>
                        <b>Имя клиента:</b> {orderData.client_name || 'Не указано'} | 
                        <b> Телефон клиента:</b> {orderData.client_phone || 'Не указано'} | 
                        <b> Адрес клиента:</b> {orderData.client_address || 'Не указано'}
                      </p>
                    </div>
                    <div className="packer-info">
                      <p>
                        <b>Имя модератора:</b> {orderData.packer?.name || 'Не указано'} | 
                        <b> Телефон модератора:</b> {orderData.packer?.phone || 'Не указано'} | 
                        <b> Email модератора:</b> {orderData.packer?.email || 'Не указано'}
                      </p>
                    </div>
                    <div className="courier-info">
                      <p>
                        <b>Имя курьера:</b> {orderData.courier?.name || 'Не указано'} | 
                        <b> Телефон курьера:</b> {orderData.courier?.phone || 'Не указано'} | 
                        <b> Email курьера:</b> {orderData.courier?.email || 'Не указано'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>Редактирование информации о заказе</h2>
                    <div className="client-info">
                      <label>
                        Имя клиента:
                        <input
                          type="text"
                          id="price-input"
                          value={editedClientInfo.client_name}
                          onChange={(e) => setEditedClientInfo({ ...editedClientInfo, client_name: e.target.value })}
                        />
                      </label>
                      <label>
                        Телефон клиента:
                        <input
                          type="text"
                          id="price-input"
                          value={editedClientInfo.client_phone}
                          onChange={(e) => setEditedClientInfo({ ...editedClientInfo, client_phone: e.target.value })}
                        />
                      </label>
                      <label>
                        Адрес клиента:
                        <input
                          type="text"
                          id="price-input"
                          value={editedClientInfo.client_address}
                          onChange={(e) => setEditedClientInfo({ ...editedClientInfo, client_address: e.target.value })}
                        />
                      </label>
                      <label>
                        Дата доставки:
                        <input
                          type="date" // Change to "date" if you want a date picker
                          value={editedClientInfo.delivery_date}
                          onChange={(e) => setEditedClientInfo({ ...editedClientInfo, delivery_date: e.target.value })}
                        />
                      </label>
                      <button className="btn btn-primary" onClick={handleSaveChanges}>Сохранить изменения</button>
                      <button className="btn btn-primary" onClick={handleConfirmOrder}>Подтвердить заказ</button>
                      <button className="btn btn-primary" onClick={handleDeleteOrder}>Отменить заказ</button>
                    </div>
                  </>
                )}
                <h3>Информация о товарах</h3>
                {orderData.bouquet_details.map((detail, index) => (
                  <div key={index} className="card">
                    <img
                      src={(detail.bouquet.full_url !== '' && detail.bouquet.full_url !== 'http://localhost:9000/images/images/None') ? detail.bouquet.full_url : logoImage}
                      alt={detail.bouquet.full_url}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h5 className="card-title">{detail.bouquet.name}</h5>
                      <p className="card-text">Цена: {detail.bouquet.price || 'Цена не указана'} рублей</p>
                      <p className="card-text">Количество: 
                        {orderData.status === 'draft' ? (
                          <input
                            type="number"
                            id="price-input"
                            value={editedQuantities[detail.bouquet.bouquet_id] || ''}
                            onChange={(e) => {
                              const newQuantities = { ...editedQuantities };
                              newQuantities[detail.bouquet.bouquet_id] = Number(e.target.value);
                              setEditedQuantities(newQuantities);
                            }}
                          />
                        ) : (
                          detail.quantity || 'Не указано'
                        )}
                      </p>
                      {orderData.status === 'draft' && (
                        <div>
                          <button className="btn btn-primary" onClick={() => handleSaveChangesBouquets(detail.bouquet.bouquet_id)}>Сохранить изменения</button>
                          <button className="btn btn-primary" onClick={() => handleDeleteBouquet(detail.bouquet.bouquet_id)}>
                            <span role="img" aria-label="Delete">❌</span> Удалить товар
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BouquetDetailPage;

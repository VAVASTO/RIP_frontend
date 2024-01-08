import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';  // Import Axios library
import Breadcrumbs from './Breadcrumbs';
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
  const { id } = useParams<{ id: string }>();
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [editedQuantities, setEditedQuantities] = useState<{ [key: number]: number }>({});

  const breadcrumbsItems = [
    { label: 'Все букеты', link: '/bouquetss' },
    { label: 'Подробнее', link: '' }
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
          setEditedQuantities(initialQuantities);
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

  const handleSaveChanges = async (bouquetId: number) => {
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
        <h1>Petal Provisions</h1>
      </header>
      <div className="container">
        <div className="row">
          <Breadcrumbs items={breadcrumbsItems} />
          <div className="col">
            {orderData && (
              <div className="order-details">
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
                          <button onClick={() => handleSaveChanges(detail.bouquet.bouquet_id)}>Сохранить изменения</button>
                          <button onClick={() => handleDeleteBouquet(detail.bouquet.bouquet_id)}>
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

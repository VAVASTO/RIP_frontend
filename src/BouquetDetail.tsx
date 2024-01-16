import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import './BouquetDetail.css';
import image_1 from '/images/basket_with_flowers.jpeg'
import image_2 from '/images/flowers_for_merry.jpg'
import image_3 from '/images/flowers_for_outlet.jpg'

interface Bouquet {
  bouquet_id: number;
  name: string;
  description: string;
  price: string;
  full_url: string;
}

const mockBouquets: Bouquet[] = [
  {
    bouquet_id: 1,
    name: 'Подарочные корзины с цветами',
    description: 'Наши подарочные корзины - это полный праздник в одной упаковке. Мы предлагаем широкий выбор букетов цветов, которые можно дополнить шоколадом, вином, ароматическими свечами или даже плюшевыми мишками. Отправьте этот прекрасный подарок с доставкой к двери, чтобы порадовать кого-то особенного.',
    price: '7000',
    full_url: image_1,
  },
  {
    bouquet_id: 2,
    name: 'Цветы на свадьбу',
    description: 'Для вашего особенного дня мы предлагаем услугу оформления свадебных цветов с доставкой и установкой на месте. Мы создадим магические цветочные композиции, которые подчеркнут красоту и романтику вашей свадьбы. Доверьтесь нам, чтобы сделать этот день незабываемым.',
    price: '10000',
    full_url: image_2,
  },
  {
    bouquet_id: 3,
    name: 'Цветы на выпускной',
    description: 'Поздравьте выпускников с нашими уникальными букетами. Наши цветы помогут создать незабываемую атмосферу и добавят радости в это важное событие. Закажите доставку к двери и сделайте этот день особенным для них.',
    price: '8000',
    full_url: image_3,
  },
];

const BouquetDetailPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [bouquetData, setBouquetData] = useState<Bouquet | null>(null);

  useEffect(() => {
    if (id) {
      const bouquetId = parseInt(id, 10);
      const fetchedBouquetData = mockBouquets.find(bouquet => bouquet.bouquet_id === bouquetId);
      if (fetchedBouquetData) {
        setBouquetData(fetchedBouquetData);
      } else {
        console.error(`Bouquet with ID ${bouquetId} not found`);
      }
    }
  }, [id]);


  const breadcrumbsItems = [
    { label: 'Все букеты', link: '/bouquetss' },
    { label: 'Подробнее', link: '' }
  ];

  return (
    <div className="container">
      <div className="row">
        <Breadcrumbs items={breadcrumbsItems} />
        <div className="col">
          {bouquetData ? (
            <div className="card">
              <img src={bouquetData.full_url} alt={bouquetData.name} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{bouquetData.name}</h5>
                <p className="card-text">{bouquetData.description}</p>
                <p className="card-text">Цена: {bouquetData.price} рублей</p>
              </div>
            </div>
          ) : (
            <p>Загрузка данных...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BouquetDetailPage;
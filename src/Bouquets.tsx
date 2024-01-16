import { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import './Bouquet.css';
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
  // Add more mock bouquets as needed
];

const BouquetsPage: FC = () => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('q') || '';
  const priceParam = queryParams.get('price') || '';

  const [bouquets, setBouquets] = useState<Bouquet[]>([]);
  const [searchValue, setSearchValue] = useState(searchParam);
  const [priceValue, setPriceValue] = useState(priceParam);

  const fetchBouquets = (searchText: string, price: string) => {
    // Use mock data instead of fetching from the API
    const filteredBouquets = mockBouquets.filter(bouquet =>
      bouquet.name.toLowerCase().includes(searchText.toLowerCase()) &&
      bouquet.price.includes(price)
    );
    setBouquets(filteredBouquets);
  };
  const breadcrumbsItems = [
    { label: 'Все букеты', link:'' } // Link to the current page
  ];

  const handleSearchClick = () => {
    // Redirect to the same frontend page with the search query parameter
    navigateTo(`/bouquetss/?q=${searchValue}&price=${priceValue}`);
    // Fetch data after navigating to the new URL
    fetchBouquets(searchValue, priceValue);
  };

  useEffect(() => {
    // Fetch data when the component mounts for the first time or when search query changes
    fetchBouquets(searchValue, priceValue);
  }, []); // Update the effect to run whenever searchValue changes

  return (
    <div className="album">
      <div className="container">
        <div className="row">
        <Breadcrumbs items={breadcrumbsItems} /> {/* Include Breadcrumbs component */}
            <div className="search-bar">
              <input
                type="text"
                id="search-input"
                placeholder="Поиск"
                value={searchValue}
                onChange={(event => setSearchValue(event.target.value))}
              />
              <input
              type="number"
              id="price-input"
              placeholder="Цена"
              value={priceValue}
              onChange={(event => setPriceValue(event.target.value))}
              />
              <button type="button" id="search-button" onClick={handleSearchClick}>
                Искать
              </button>
            </div>

            {bouquets.map((bouquet) => (
            <div className="col" key={bouquet.bouquet_id}>
              <div className="card">
                <img src={bouquet.full_url} alt={bouquet.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{bouquet.name}</h5>
                  <p className="card-text">{bouquet.description}</p>
                  <p className="card-text">Цена: {bouquet.price} рублей</p>
                  {/* Add more text elements here if needed */}
                  <a href={`/RIP_front/#/bouquetss/${bouquet.bouquet_id}/`} className="btn btn-primary">
                    Подробнее
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BouquetsPage;
// ModeratorBouquetsChangePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import Breadcrumbs from './Breadcrumbs';
import './Moderator_bouquets_change.css'; // Import the CSS file
import logoImage from './logo.png';
import LogoutButton from './LogoutButton';
import { RootState } from './redux/store';

const ModeratorBouquetsChangePage: React.FC = () => {
  const navigateTo = useNavigate();
  const isUserLoggedIn = document.cookie.includes('session_key');
  const user_role = useSelector((state: RootState) => state.auth.user_role);
  const username = useSelector((state: RootState) => state.auth.username);
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
    navigateTo('/bouquets/');
  };


  const { id } = useParams<{ id: string }>();
  const [bouquetData, setBouquetData] = useState({
    name: '',
    description: '',
    price: '',
    full_url: '',
  });

  const [editedData, setEditedData] = useState({
    name: '',
    description: '',
    price: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const breadcrumbsItems = [
    { label: 'Все букеты', link: '/bouquetss' },
    { label: 'Подробнее', link: '' },
  ];

  useEffect(() => {
    const fetchBouquetData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/bouquets/${id}/`);
        const data = await response.json();
        setBouquetData(data);
        setEditedData(data);
      } catch (error) {
        console.error('Error fetching bouquet data:', error);
      }
    };

    fetchBouquetData();

    return () => {
      // Cleanup code (if needed)
    };
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Upload photo
      const formData = new FormData();
      formData.append('key', 'photo');
      formData.append('photo', selectedFile as Blob);

      // You may want to handle this upload endpoint on your server side
      const uploadResponse = await fetch('http://localhost:8000/upload_photo/', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      console.log('Upload Response:', uploadData);

      // Update bouquet data including image_url
      const updatedDataToSend = {
        ...editedData,
        image_url: uploadData.photo_url, // Assuming the response includes the photo_url field
      };

      const response = await fetch(`http://localhost:8000/bouquets/${id}/edit/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDataToSend),
      });

      const updatedData = await response.json();
      setBouquetData(updatedData);
    } catch (error) {
      console.error('Error updating bouquet data:', error);
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
            <div className="card">
              <img
                src={
                  bouquetData.full_url !== '' && bouquetData.full_url !== 'http://localhost:9000/images/images/None'
                    ? bouquetData.full_url
                    : logoImage
                }
                alt={bouquetData.full_url}
                className="card-img-top"
              />
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Имя
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="name"
                      name="name"
                      value={editedData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Описание
                    </label>
                    <textarea
                      className="form-control form-control-dis"
                      id="description"
                      name="description"
                      value={editedData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                      Цена
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="price"
                      name="price"
                      value={editedData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="photo" className="form-label">
                      Обновить фото
                    </label>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        id="photo"
                        name="photo"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={openFileInput}
                      >
                        Выберите файл
                      </button>
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                    Сохранить изменения
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorBouquetsChangePage;

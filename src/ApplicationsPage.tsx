// ModeratorBouquetsPage.tsx
import React, { FC, useState, useEffect } from 'react';
import './ApplicationsPage.css'
import { useNavigate } from 'react-router-dom';
import logoImage from './logo.png';
import { useSelector } from 'react-redux';
import axios from 'axios';
import LogoutButton from './LogoutButton';
import { RootState } from './redux/store';

interface Application {
  application_id: number;
  manager: {
    name: string;
  } | null;
  packer: {
    name: string;
  } | null;
  courier: {
    name: string;
  } | null;
  client_name: string;
  client_phone: string;
  client_address: string;
  receiving_date: string;
  delivery_date: string;
  completion_date: string | null;
  status: string;
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

const ApplicationsPage: FC = () => {
  const handleLoginClick = () => {
    navigateTo('/login/');
  };

  const handleAccept = async (applicationId: number) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/applications/${applicationId}/change_status_packer/`,
        { application_status: 'delivering' }
      );

      // Handle success (you can update state, show a notification, etc.)
      console.log('Application accepted successfully:', response.data);

      // Optionally, you can refetch the applications to update the UI
      fetchApplications();
    } catch (error) {
      console.error('Error accepting application:', error);
    }
  };

  const handleReject = async (applicationId: number) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/applications/${applicationId}/change_status_packer/`,
        { application_status: 'rejected' },
      );

      // Handle success (you can update state, show a notification, etc.)
      console.log('Application rejected successfully:', response.data);

      // Optionally, you can refetch the applications to update the UI
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const handleLogoutClick = () => {
    navigateTo('/bouquets/');
  };

  const navigateTo = useNavigate();
  const isUserLoggedIn = document.cookie.includes('session_key');
  const username = useSelector((state: RootState) => state.auth.username);

  const [applications, setApplications] = useState<Application[]>([]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:8000/applications/', { withCredentials: true });
      const data = response.data;
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

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
            <table className="table" style={{ marginTop: '20px' }}>
            <thead>
                <tr>
                    <th scope="col">Менеджер</th>
                    <th scope="col">Модератор</th>
                    <th scope="col">Клиент</th>
                    <th scope="col">Телефон Клиента</th>
                    <th scope="col">Дата Формирования</th>
                    <th scope="col">Дата Доставки</th>
                    <th scope="col">Статус</th>
                    <th scope="col">Действия</th>
                </tr>
                </thead>

                <tbody>
                {applications.map((application, index) => (
                    <React.Fragment key={application.application_id}>
                    <tr>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{application.manager?.name || 'Неизвестно'}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{application.packer?.name || 'Неизвестно'}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{application.client_name}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{application.client_phone}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{application.receiving_date}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{application.delivery_date}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{translateStatus(application.status)}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        {application.status === 'formed' && (
                            <div>
                                <button onClick={() => handleAccept(application.application_id)} className="btn btn-primary">
                                Принять
                                </button>
                                <button onClick={() => handleReject(application.application_id)} className="btn btn-primary">
                                Отклонить
                                </button>
                            </div>
                        )}
                        <a href={`/applications/${application.application_id}/`} className="btn btn-primary">
                            Подробнее
                        </a>
                        </td>         </tr>
                    {index !== applications.length - 1 && <tr className="table-divider"></tr>}
                    </React.Fragment>
                ))}
                </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;

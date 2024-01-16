// ModeratorBouquetsPage.tsx
import React, { FC, useState, useEffect } from 'react';
import './ApplicationsPage.css';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import logoImage from './logo.png';
import axios from 'axios';
import LogoutButton from './LogoutButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import {setClientName, setStartDate, setEndDate, setStatus} from './redux/searchSlice';

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

function translateStatusReverse(status: string): string {
  switch (status) {
    case 'удалено':
      return 'deleted';
    case 'завершено':
      return 'completed';
    case 'сформировано':
      return 'formed';
    case 'доставляется':
      return 'delivering';
    case 'отклонено':
      return 'rejected';
    default:
      return '';
  }
}

const ApplicationsPage: FC = () => {
  const [localStartDate, setLocalStartDate] = useState<string>('');
  const [localEndDate, setLocalEndDate] = useState<string>('');
  const [localStatus, setLocalStatus] = useState<string>('');
  const [localClientName, setLocalClientName] = useState<string>('');
  const dispatch = useDispatch();

  const handleLoginClick = () => {
    navigateTo('/login/');
  };

  const handleAccept = async (applicationId: number) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/applications/${applicationId}/change_status_packer/`,
        { application_status: 'delivering' }
      );
      fetchApplicationsAndSetInterval();
      console.log('Application accepted successfully:', response.data);
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
      fetchApplicationsAndSetInterval();
      console.log('Application rejected successfully:', response.data);
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
  const user_role = useSelector((state: RootState) => state.auth.user_role);

  const [applications, setApplications] = useState<Application[]>([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  let custom_params = {};

  const handleSearch = async () => {
    // Filter applications based on client name on the frontend
    const filteredApplications = applications.filter((application) => {
      return true;
      if (!application.client_name) {
        return false;
      }
      return application.client_name.toLowerCase().includes(clientName.toLowerCase());
    });
    dispatch(setStartDate(localStartDate));
    dispatch(setEndDate(localEndDate));
    dispatch(setClientName(localClientName));
    dispatch(setStatus(localStatus));
    setApplications(filteredApplications);
    setIsSearchClicked(true);
  };
  
  const latestStartDateFromRedux = useSelector((state: RootState) => state.search.startDate);
  const latestEndDateFromRedux = useSelector((state: RootState) => state.search.endDate);
  const latestStatusFromRedux = useSelector((state: RootState) => state.search.status);
  const latestClientNameFromRedux = useSelector((state: RootState) => state.search.clientName);
  const fetchApplicationsAndSetInterval = async () => {
    try {
      setIsSearchClicked(false);
      
      const response = await axios.get('http://localhost:8000/applications/', {
        withCredentials: true,
        params: {
          start_date: latestStartDateFromRedux,
          end_date: latestEndDateFromRedux,
          status: translateStatusReverse(latestStatusFromRedux.toLowerCase()),
        },
      });
      const data = response.data;

      const filteredApplications = data.filter((data) => {
        if (!data.client_name) {
          return false;
        }
        return data.client_name.toLowerCase().includes(latestClientNameFromRedux.toLowerCase());
      });

      setApplications(filteredApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  useEffect(() => {
    setLocalStartDate(latestStartDateFromRedux)
    setLocalEndDate(latestEndDateFromRedux)
    setLocalStatus(latestStatusFromRedux)
    setLocalClientName(latestClientNameFromRedux)
    const pollInterval = setInterval(fetchApplicationsAndSetInterval, 1000); // 10 seconds

    // Fetch applications initially
    fetchApplicationsAndSetInterval();

    // Cleanup interval on component unmount
    return () => clearInterval(pollInterval);
  }, [isSearchClicked]);

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
            <div className="date-filters">
              <label htmlFor="startDate">Дата начала:</label>
              <input
                type="date"
                id="startDate"
                value={localStartDate}
                onChange={(e) => setLocalStartDate(e.target.value)}
              />  

              <label htmlFor="endDate">Дата конца:</label>
              <input
                type="date"
                id="endDate"
                value={localEndDate}
                onChange={(e) => setLocalEndDate(e.target.value)}
              />

              <label htmlFor="status">Статус:</label>
              <input
                type="text"
                id="price-input"
                value={localStatus}
                onChange={(e) => setLocalStatus(e.target.value)}
              />

              {/* Step 2: Add input field for client name */}
              <label htmlFor="clientName">Имя клиента:</label>
              <input
                type="text"
                id="price-input"
                value={localClientName}
                onChange={(e) => setLocalClientName(e.target.value)}
              />

              <button
                onClick={() => {
                  handleSearch();
                }}
                className="btn btn-primary"
              >
                Искать
              </button>
            </div>
          </div>
          <div className="row">
            <table className="table" style={{ marginsearchBouquetsReducerTop: '20px' }}>
              <thead>
                <tr>
                  <th scope="col">Менеджер</th>
                  <th scope="col">Модератор</th>
                  <th scope="col">Клиент</th>
                  <th scope="col">Телефон Клиента</th>
                  <th scope="col">Дата Формирования</th>
                  <th scope="col">Дата Доставки</th>
                  <th scope="col">Статус</th>
                  {user_role === 'moderator' && <th scope="col">Действия</th>}
                </tr>
              </thead>

              <tbody>
                {applications.map((application, index) => (
                  <React.Fragment key={application.application_id}>
                    <tr>
                      <td style={{ border: '1px solid #000000', padding: '8px' }}>{application.manager?.name || 'Неизвестно'}</td>
                      <td style={{ border: '1px solid #000000', padding: '8px' }}>{application.packer?.name || 'Неизвестно'}</td>
                      <td style={{ border: '1px solid #000000', padding: '8px' }}>{application.client_name}</td>
                      <td style={{ border: '1px solid #000000', padding: '8px' }}>{application.client_phone}</td>
                      <td style={{ border: '1px solid #000000', padding: '8px' }}>
                      {format(new Date(application.receiving_date), 'dd.MM.yyyy HH:mm')}
                    </td>
                    <td style={{ border: '1px solid #000000', padding: '8px' }}>
                    {format(new Date(application.delivery_date), 'dd.MM.yyyy')}
                    </td>
                      <td style={{ border: '1px solid #000000', padding: '8px' }}>{translateStatus(application.status)}</td>
                      {user_role === 'moderator' && (
                        <td style={{ border: '1px solid #000000', padding: '8px' }}>
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
                          <a
                          className="btn btn-primary"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent page refresh
                            navigateTo(`/applications/${application.application_id}/`);
                          }}
                        >
                          Подробнее
                        </a>
                        </td>
                      )}
                    </tr>
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
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BouquetsPage from './Bouquets';
import BouquetDetailPage from './BouquetDetail';
import RegistrationPage from './components/Registration'
import LoginPage from './components/LoginPage';
import { Provider } from 'react-redux'; // Импортируйте Provider
import { store } from './redux/store'; // Импортируйте ваш Redux store

const router = createBrowserRouter([
  {
    path: '/login/',
    element: <LoginPage />,
  },
  {
    path: '/register/',
    element: <RegistrationPage />,
  },
  {
    path: '/bouquets/',
    element: <BouquetsPage />,
  },
  {
    path: '/bouquets/:id/',
    element: <BouquetDetailPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <hr />
    <Provider store={store}> {/* Оберните ваше приложение в Provider */}
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);

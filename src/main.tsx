import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import BouquetsPage from './Bouquets';
import BouquetDetailPage from './BouquetDetail';
import RegistrationPage from './components/Registration';
import LoginPage from './components/LoginPage';
import ModeratorBouquetsPage from './Moderator_bouquets';
import ModeratorBouquetsChangePage from './Moderator_bouquets_change';
import ModeratorBouquetsNewPage from './Moderator_bouquets_new';
import ApplicationDetailPage from './Application_detail';
import ApplicationsPage from './ApplicationsPage';
import CartPage from './CartPage';
import { Provider } from 'react-redux';
import { store } from './redux/store';

console.error = () => {};
const router = createBrowserRouter([
  {
    path: '/moderator/bouquets/new/',
    element: <ModeratorBouquetsNewPage />,
  },
  {
    path: '/moderator/bouquets/',
    element: <ModeratorBouquetsPage />,
  },
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
  {
    path: '/moderator/bouquets/change/:id/',
    element: <ModeratorBouquetsChangePage />,
  },
  {
    path: '/applications/',
    element: <ApplicationsPage />,
  },
  {
    path: '/applications/:id/',
    element: <ApplicationDetailPage />,
  },
  {
    path: '/cart/',
    element: <CartPage />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <hr />
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
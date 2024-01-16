import ReactDOM from 'react-dom';
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import BouquetsPage from './Bouquets';
import BouquetDetailPage from './BouquetDetail';  

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/bouquetss/" />} />
      <Route path="/bouquetss/" element={<BouquetsPage />} />
      <Route path="/bouquetss/:id/" element={<BouquetDetailPage />} />
    </Routes>
  </HashRouter>,
  document.getElementById('root')
);

import ReactDOM from 'react-dom';
import {HashRouter, Route, Routes} from "react-router-dom";
import BouquetsPage from './Bouquets';
import BouquetDetailPage from './BouquetDetail';  // Import your BouquetDetail component

ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/bouquetss/" element={<BouquetsPage />}/>
      <Route path="/bouquetss/:id/" element={<BouquetDetailPage />} />
    </Routes>
  </HashRouter>,
  document.getElementById('root')
);
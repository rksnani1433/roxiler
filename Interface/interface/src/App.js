import './App.css';
import Table from './components/Table';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const App = () => (
  <div>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/transactions" />} />
        <Route path="/transactions" element={<Table />} />
      </Routes>
    </Router>
  </div>
);

export default App;

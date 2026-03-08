import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import ReservationsPage from './pages/ReservationsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/item/:id" element={<ItemDetailsPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import ReservationsPage from './pages/ReservationsPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import PostItemPage from './pages/PostItemPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/item/:id" element={<ItemDetailsPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/post-item" element={<PostItemPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

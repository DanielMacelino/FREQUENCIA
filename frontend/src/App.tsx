import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import './App.css';
import UserSelect from './components/UserSelect';
import Choice from './pages/Choice';
import Fatura from './pages/Fatura';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<UserSelect />} />
            <Route path="/choice" element={<Choice />} />
            <Route path="/frequencia" element={<Dashboard />} />
            <Route path="/fatura" element={<Fatura />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;


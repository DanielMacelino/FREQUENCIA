import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './App.css';
import UserSelect from './components/UserSelect';
import Choice from './pages/Choice';
import FaturaEmbed from './pages/FaturaEmbed';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserSelect />} />
        <Route path="/choice" element={<Choice />} />
        <Route path="/frequencia" element={<Dashboard />} />
        <Route path="/fatura" element={<FaturaEmbed />} />
      </Routes>
    </Router>
  );
}

export default App;


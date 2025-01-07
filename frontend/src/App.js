import { Router, Routes, Route, React } from './imports';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Options from './components/Options';
import Charts from './components/Charts';
import Budget from './components/Budget';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/options" element={<Options />} />
        <Route path="/charts" element={<Charts />} />
        <Route path="/budget" element={<Budget />} />
      </Routes>
    </Router>
  );
}

export default App;

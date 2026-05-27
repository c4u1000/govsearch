import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Opportunity } from './pages/Opportunity';
import { SavedSearches } from './pages/SavedSearches';
import { NAICS } from './pages/NAICS';
import { Setup } from './pages/Setup';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/opportunity/:id" element={<Opportunity />} />
          <Route path="/saved" element={<SavedSearches />} />
          <Route path="/naics" element={<NAICS />} />
          <Route path="/setup" element={<Setup />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
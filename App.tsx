import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TemplatesPage from './pages/TemplatesPage';
import BuildResumePage from './pages/BuildResumePage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/build" element={<BuildResumePage />} />
            </Routes>
        </Router>
    );
};

export default App;
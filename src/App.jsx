// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage.jsx';
import HomePage from './components/HomePage.jsx';
import CVPage from './components/CVPage.jsx';
import ContactPage from './components/ContactPage.jsx';
import StatementPage from './components/StatementPage.jsx';
import ProjectThumbnailPage from './components/ProjectThumbnailPage.jsx';
import ProjectDetail from './components/ProjectDetail.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/" element={<HomePage />} />

      <Route path="/:slug/thumbnail" element={<ProjectThumbnailPage />} />
      <Route path="/:slug/detail/:id" element={<ProjectDetail />} />
      <Route path="/archive/thumbnail" element={<ProjectThumbnailPage />} />
      <Route path="/archive/:imgId" element={<ProjectDetail />} />

      <Route path="/cv" element={<CVPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/statement" element={<StatementPage />} />
      {/* Optionally, add a 404/page-not-found route here */}
    </Routes>
  );
}
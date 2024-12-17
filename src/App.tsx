import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LayoutProvider } from './contexts/LayoutContext';
import { HelpProvider } from './contexts/HelpContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import WelcomeSplash from './components/WelcomeSplash';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import CandidateList from './pages/CandidateList';
import CandidateDetails from './pages/CandidateDetails';
import Calendar from './pages/Calendar';
import ArchivePage from './pages/Archive';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import HelpPanel from './components/help/HelpPanel';

const AppContent: React.FC = () => {
  const { showWelcome, setShowWelcome } = useAuth();

  return (
    <>
      <WelcomeSplash isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      <HelpPanel />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/pipeline" element={<Pipeline />} />
                  <Route path="/candidates" element={<CandidateList />} />
                  <Route path="/candidates/:id" element={<CandidateDetails />} />
                  <Route path="/jobs" element={<JobList />} />
                  <Route path="/jobs/:id" element={<JobDetails />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/archive" element={<ArchivePage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/admin/*" element={<AdminDashboard />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <LayoutProvider>
          <HelpProvider>
            <AppContent />
          </HelpProvider>
        </LayoutProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
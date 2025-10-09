import React, { useState, createContext, useContext } from 'react';
import { Button } from './components/ui/button';
import { Sidebar } from './components/sidebar';
import { LoginPage } from './components/login-page';
import { Dashboard } from './components/dashboard';
import { PatientManagement } from './components/patient-management';
import { TestOrderManagement } from './components/test-order-management';
import { TestResultManagement } from './components/test-result-management';
import { UserManagement } from './components/user-management';
import { InstrumentManagement } from './components/instrument-management';
import { ReagentManagement } from './components/reagent-management';
import { EventLogs } from './components/event-logs';
import { Reports } from './components/reports';
import { PatientResults } from './components/patient-results';
import { AppUser, AppUserRole } from './types/database';

// Re-export for backward compatibility
export type UserRole = AppUserRole;
export type User = AppUser;

export type AppContextType = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    if (!user) return <LoginPage />;
    
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientManagement />;
      case 'test-orders':
        return <TestOrderManagement />;
      case 'test-results':
        return <TestResultManagement />;
      case 'users':
        return <UserManagement />;
      case 'instruments':
        return <InstrumentManagement />;
      case 'reagents':
        return <ReagentManagement />;
      case 'event-logs':
        return <EventLogs />;
      case 'reports':
        return <Reports />;
      case 'my-results':
        return <PatientResults />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppContext.Provider value={{ user, setUser, currentPage, setCurrentPage }}>
      <div className="size-full min-h-screen bg-background">
        {user ? (
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-hidden">
              {renderCurrentPage()}
            </main>
          </div>
        ) : (
          <LoginPage />
        )}
      </div>
    </AppContext.Provider>
  );
}
import React, { useState } from 'react';
import LoginScreen from './components/auth/LoginScreen';
import SidebarLayout from './components/layout/SidebarLayout';
import CleanDashboard from './components/dashboard/CleanDashboard';
import RegisterInstrument from './components/instruments/RegisterInstrument';
import CleanInstrumentsList from './components/instruments/CleanInstrumentsList';
import EnterObservations from './components/tests/EnterObservations';
import CalculationResults from './components/tests/CalculationResults';
import TestReportsList from './components/reports/TestReportsList';
import TestReportView from './components/reports/TestReportView';
import CleanAuditTrail from './components/audit/CleanAuditTrail';
import CleanVerifyPortal from './components/verification/CleanVerifyPortal';
import CleanRuleEngine from './components/rules/CleanRuleEngine';
import CleanUsersList from './components/users/CleanUsersList';
import CleanSettings from './components/settings/CleanSettings';
import PitchModeModal from './components/pitch/PitchModeModal';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Start directly logged in to show dashboard, or switchable to login screen
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState({
    name: 'Anita Sharma',
    role: 'Lab Technician',
    email: 'anita.sharma@lab.gov.in',
    avatar: '👩‍🔬'
  });
  const [showPitchMode, setShowPitchMode] = useState(false);

  // If user logs out or selects login
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={(user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
          setCurrentTab('dashboard');
        }}
      />
    );
  }

  // If on public verify portal standalone view
  if (currentTab === 'verify') {
    return (
      <CleanVerifyPortal
        onBackToDashboard={() => setCurrentTab('dashboard')}
      />
    );
  }

  return (
    <SidebarLayout
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      currentUser={currentUser}
      onLogout={() => setIsLoggedIn(false)}
      onOpenPitch={() => setShowPitchMode(true)}
    >
      {/* 1. Dashboard (Screen 2) */}
      {currentTab === 'dashboard' && (
        <CleanDashboard
          currentUser={currentUser}
          onRegisterInstrument={() => setCurrentTab('instruments_new')}
          onStartTest={() => setCurrentTab('tests_new')}
          onViewReports={() => setCurrentTab('reports')}
          onVerifyPublic={() => setCurrentTab('verify')}
        />
      )}

      {/* 2. Instruments List */}
      {currentTab === 'instruments' && (
        <CleanInstrumentsList
          onNewInstrument={() => setCurrentTab('instruments_new')}
          onStartTestForInst={(inst) => setCurrentTab('tests_new')}
        />
      )}

      {/* 3. Register New Instrument (Screen 3) */}
      {currentTab === 'instruments_new' && (
        <RegisterInstrument
          onCancel={() => setCurrentTab('instruments')}
          onSave={(data) => {
            alert('Instrument ' + data.model + ' (' + data.serialNumber + ') registered successfully!');
            setCurrentTab('instruments');
          }}
        />
      )}

      {/* 4. Test Management / Enter Observations (Screen 4) */}
      {(currentTab === 'test_management' || currentTab === 'tests_new') && (
        <EnterObservations
          onPrevious={() => setCurrentTab('dashboard')}
          onNext={() => setCurrentTab('tests_results')}
        />
      )}

      {/* 5. Calculation & Compliance Results (Screen 5) */}
      {currentTab === 'tests_results' && (
        <CalculationResults
          onEditObservations={() => setCurrentTab('tests_new')}
          onViewRuleDetails={() => setCurrentTab('rule_engine')}
          onGenerateReport={() => setCurrentTab('report_view')}
        />
      )}

      {/* 6. Test Reports List (Screen 7) */}
      {currentTab === 'reports' && (
        <TestReportsList
          onViewReport={(repId) => setCurrentTab('report_view')}
        />
      )}

      {/* 7. Test Report Document View (Screen 6) */}
      {currentTab === 'report_view' && (
        <TestReportView
          onBack={() => setCurrentTab('reports')}
          onVerifyLink={() => setCurrentTab('verify')}
        />
      )}

      {/* 8. Audit Trail (Screen 8) */}
      {currentTab === 'audit_logs' && (
        <CleanAuditTrail />
      )}

      {/* 9. Rule Engine */}
      {currentTab === 'rule_engine' && (
        <CleanRuleEngine />
      )}

      {/* 10. Users List */}
      {currentTab === 'users' && (
        <CleanUsersList />
      )}

      {/* 11. Settings */}
      {currentTab === 'settings' && (
        <CleanSettings />
      )}

      {/* SIH Pitch Deck Companion Modal */}
      {showPitchMode && (
        <PitchModeModal
          onClose={() => setShowPitchMode(false)}
          onJumpToTab={(tab) => {
            setShowPitchMode(false);
            if (tab === 'tests') setCurrentTab('tests_new');
            else if (tab === 'rules') setCurrentTab('rule_engine');
            else if (tab === 'verification') setCurrentTab('verify');
            else setCurrentTab(tab);
          }}
          onLoadScenario={(scenKey) => {
            setShowPitchMode(false);
            setCurrentTab('tests_results');
          }}
        />
      )}

    </SidebarLayout>
  );
}

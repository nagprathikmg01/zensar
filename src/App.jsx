import React from 'react';
import { useApp } from './context/AppContext';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import KPICards from './components/KPICards';
import TransactionTable from './components/TransactionTable';
import CaseReviewModal from './components/CaseReviewModal';
import RuleEngineModal from './components/RuleEngineModal';
import SimulateModal from './components/SimulateModal';
import AuditLogModal from './components/AuditLogModal';
import { AlertCircle, CheckCircle2, Info, Radio } from 'lucide-react';

export default function App() {
  const { currentUser, toast } = useApp();

  // If user is not logged in, show the sleek enterprise login portal
  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      {/* Top Command Center Header */}
      <Header />

      {/* Main Monitoring Operations Deck */}
      <main className="main-content">
        <KPICards />
        <TransactionTable />
      </main>

      {/* Interactive Modals */}
      <CaseReviewModal />
      <RuleEngineModal />
      <SimulateModal />
      <AuditLogModal />

      {/* Bottom Interbank Telemetry Ticker */}
      <div className="interbank-ticker-bar">
        <div className="ticker-label">
          <Radio size={12} />
          <span>NPCI LIVE TELEMETRY</span>
        </div>
        <div className="ticker-content">
          <span>⚡ SBI UPI Core: Latency 42ms (Nominal)</span>
          <span>•</span>
          <span>🛡️ HDFC Bank Node: 0.002% Anomaly Ratio</span>
          <span>•</span>
          <span>🟢 ICICI Bridge: IMPS/UPI Synchronized</span>
          <span>•</span>
          <span>🚨 Axis Bank: 3 Mule Clusters Quarantined</span>
          <span>•</span>
          <span>📜 RBI PMLA Registry v4.8: Connected</span>
          <span>•</span>
          <span>⚡ State Bank of India: 48,920 TPS Clearing Rate</span>
          <span>•</span>
          <span>🛡️ PhonePe & Google Pay VPA Heuristics: Armed</span>
          <span>•</span>
          <span>⚡ SBI UPI Core: Latency 42ms (Nominal)</span>
          <span>•</span>
          <span>🛡️ HDFC Bank Node: 0.002% Anomaly Ratio</span>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className="toast-pill">
            {toast.type === 'warning' && <AlertCircle size={18} color="#fbbf24" />}
            {toast.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
            {toast.type === 'success' && <CheckCircle2 size={18} color="#34d399" />}
            {toast.type === 'info' && <Info size={18} color="var(--saffron-primary)" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

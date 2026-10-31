import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  Sliders, 
  FileText, 
  RotateCcw, 
  Zap, 
  LogOut, 
  Play,
  Pause,
  Flame,
  ShieldCheck
} from 'lucide-react';

export default function Header() {
  const { 
    currentUser, 
    logout, 
    setActiveModal, 
    resetDatabase,
    isStreaming,
    toggleStream,
    streamCount,
    injectLiveAttack
  } = useApp();

  return (
    <header className="top-header">
      {/* Brand & Indian Compliance Badges */}
      <div className="brand-section">
        <div className="brand-logo">
          <ShieldAlert size={26} />
        </div>
        <div className="brand-title-wrap">
          <h1>
            FraudAlert Sentinel
            <span className={`live-indicator ${isStreaming ? 'streaming-active' : ''}`}>
              <span className={`pulse-dot ${isStreaming ? 'pulse-fast' : ''}`}></span>
              {isStreaming ? 'Live UPI Stream Active' : 'NPCI Gateway Armed'}
            </span>
          </h1>
          <div className="sub-tag">
            <span className="compliance-tag">
              <ShieldCheck size={12} />
              RBI Cyber Framework
            </span>
            <span>•</span>
            <span style={{ color: 'var(--saffron-primary)', fontWeight: 600 }}>NPCI Real-Time Bridge</span>
            <span>•</span>
            <span style={{ color: 'var(--cyan-primary)' }}>Zensar BFSI SOC</span>
          </div>
        </div>
      </div>

      {/* Stream Controls & Action Buttons */}
      <div className="header-actions">
        
        {/* Stream Toggle Switch Widget */}
        <div className="stream-control-widget">
          <button
            onClick={toggleStream}
            className={`stream-toggle-btn ${isStreaming ? 'is-on' : 'is-off'}`}
            title={isStreaming ? 'Pause Real-Time UPI Transaction Stream' : 'Start Real-Time UPI Transaction Stream (3-5s)'}
          >
            {isStreaming ? <Pause size={13} /> : <Play size={13} />}
            <span>UPI Stream: <strong>{isStreaming ? 'LIVE' : 'OFF'}</strong></span>
            {isStreaming && (
              <span className="stream-event-counter">
                {streamCount} tx
              </span>
            )}
          </button>
        </div>

        {/* Quick Inject Live Attack Button */}
        <button
          className="btn btn-danger-action"
          onClick={injectLiveAttack}
          title="Instantly inject a critical Hawala / Mule fraud attack into the live stream"
        >
          <Flame size={15} />
          <span>Inject Live Attack</span>
        </button>

        {/* Custom Simulator Modal Trigger */}
        <button
          className="btn btn-primary"
          onClick={() => setActiveModal('SIMULATE')}
          title="Open Indian financial threat scenarios"
        >
          <Zap size={14} />
          <span>Scenarios</span>
        </button>

        {/* Rule Engine Studio */}
        <button
          className="btn btn-secondary"
          onClick={() => setActiveModal('RULES')}
          title="Configure RBI/NPCI detection thresholds and policy triggers"
        >
          <Sliders size={14} />
          <span>Rule Engine</span>
        </button>

        {/* Audit Trail */}
        <button
          className="btn btn-secondary"
          onClick={() => setActiveModal('AUDIT')}
          title="Inspect PMLA & RBI regulatory compliance audit logs"
        >
          <FileText size={14} />
          <span>Audit Log</span>
        </button>

        {/* Reset DB Demo Safety Net */}
        <button
          className="btn btn-secondary"
          onClick={resetDatabase}
          title="Re-seed initial clean Indian demo dataset"
          style={{ padding: '0.5rem' }}
        >
          <RotateCcw size={14} />
        </button>

        {/* User Profile & Logout */}
        {currentUser && (
          <div className="user-profile-badge">
            <div className="user-avatar">
              {currentUser.avatar}
            </div>
            <div className="user-meta">
              <span className="name">{currentUser.name}</span>
              <span className="role">{currentUser.badge}</span>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{ padding: '0.3rem 0.5rem', border: 'none', marginLeft: '0.4rem', color: 'var(--text-muted)' }}
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

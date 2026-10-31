import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, demoUsers } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = demoUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (found) {
      setError('');
      login(found);
    } else {
      setError('Invalid credentials. Use one of the Quick Login demo profiles below.');
    }
  };

  const handleQuickLogin = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    login(user);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="shield-icon">
            <Shield size={32} />
          </div>
          <h2>FraudAlert Sentinel</h2>
          <p>Indian BFSI & UPI Financial Crime Defense Center</p>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-xs)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#f87171',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label>SOC Analyst Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="analyst@zensar-defense.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label>Encrypted Security Token / Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
            <span>Authenticate BFSI Session</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="demo-account-pills">
          <span>⚡ 1-Click Indian SOC Hackathon Logins</span>
          <div className="demo-buttons-grid">
            {demoUsers.map(user => (
              <button
                key={user.id}
                type="button"
                className="demo-user-btn"
                onClick={() => handleQuickLogin(user)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  <ShieldCheck size={14} color="var(--saffron-primary)" />
                  <span className="name">{user.name}</span>
                </div>
                <span className="role">{user.badge}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <Lock size={12} />
          <span>Compliant with RBI Cyber Security Framework & NPCI Master Directives</span>
        </div>
      </div>
    </div>
  );
}

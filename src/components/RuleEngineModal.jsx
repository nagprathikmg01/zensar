import React from 'react';
import { useApp, formatINR } from '../context/AppContext';
import { X, Sliders, ShieldCheck } from 'lucide-react';

export default function RuleEngineModal() {
  const { 
    rules, 
    updateRule, 
    activeModal, 
    setActiveModal 
  } = useApp();

  if (activeModal !== 'RULES') return null;

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>
              <Sliders size={22} color="#1d4ed8" />
              <span>RBI & NPCI Policy Rule Studio</span>
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
              Calibrate detection thresholds and monetary limits in Indian Rupees (₹) in real time
            </div>
          </div>
          <button className="close-btn" onClick={() => setActiveModal(null)}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderLeft: '4px solid #1d4ed8',
            borderRadius: 'var(--radius-xs)',
            padding: '0.85rem 1rem',
            fontSize: '0.8rem',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <ShieldCheck size={18} color="#1d4ed8" />
            <span>
              All incoming UPI, IMPS, RTGS, and Card transactions are screened against these active policies under the RBI Master Cyber Directions.
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {rules.map((rule) => (
              <div
                key={rule.id}
                style={{
                  background: '#ffffff',
                  border: `1px solid ${rule.isEnabled ? '#cbd5e1' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-xs)',
                  opacity: rule.isEnabled ? 1 : 0.65,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.75rem', 
                      color: '#1d4ed8',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: 700
                    }}>
                      {rule.id}
                    </span>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a', fontFamily: 'var(--font-headline)' }}>{rule.name}</strong>
                    <span style={{
                      fontSize: '0.68rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '3px',
                      background: rule.severity === 'CRITICAL' ? '#fef2f2' : '#fffbeb',
                      color: rule.severity === 'CRITICAL' ? '#b91c1c' : '#b45309',
                      border: `1px solid ${rule.severity === 'CRITICAL' ? '#fecaca' : '#fde68a'}`,
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {rule.severity}
                    </span>
                  </div>

                  {/* Enable / Disable Toggle Switch */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <span style={{ fontSize: '0.75rem', color: rule.isEnabled ? '#15803d' : 'var(--text-muted)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {rule.isEnabled ? 'ARMED' : 'DISABLED'}
                    </span>
                    <input
                      type="checkbox"
                      checked={rule.isEnabled}
                      onChange={(e) => updateRule(rule.id, { isEnabled: e.target.checked })}
                      style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: '#1d4ed8' }}
                    />
                  </label>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {rule.description}
                </p>

                {/* Interactive Slider if rule has numerical threshold */}
                {rule.min !== undefined && rule.max !== undefined ? (
                  <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Configured Threshold Limit:</span>
                      <strong style={{ fontFamily: 'var(--font-mono)', color: '#1d4ed8', fontSize: '1rem' }}>
                        {rule.unit === '₹' ? formatINR(rule.threshold) : `${rule.threshold} ${rule.unit}`}
                      </strong>
                    </div>

                    <input
                      type="range"
                      min={rule.min}
                      max={rule.max}
                      step={rule.step || 1}
                      value={rule.threshold}
                      onChange={(e) => updateRule(rule.id, { threshold: Number(e.target.value) })}
                      disabled={!rule.isEnabled}
                      style={{
                        width: '100%',
                        cursor: rule.isEnabled ? 'pointer' : 'not-allowed',
                        accentColor: '#1d4ed8'
                      }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                      <span>Min: {rule.unit === '₹' ? formatINR(rule.min) : rule.min}</span>
                      <span>Max: {rule.unit === '₹' ? formatINR(rule.max) : rule.max}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)', border: '1px solid var(--border-subtle)' }}>
                    Trigger Condition: <strong style={{ color: '#1d4ed8' }}>Boolean Threat Match on {rule.category}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={() => setActiveModal(null)}>
            <span>Apply Indian BFSI Configuration</span>
          </button>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { useApp } from '../context/AppContext';
import { X, FileText, Shield, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

export default function AuditLogModal() {
  const { auditLogs, activeModal, setActiveModal } = useApp();

  if (activeModal !== 'AUDIT') return null;

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>
              <FileText size={22} color="var(--indigo-primary)" />
              <span>Compliance & Security Audit Trail</span>
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Immutable regulatory audit log for SOC2, PCI-DSS, and FinCEN compliance
            </div>
          </div>
          <button className="close-btn" onClick={() => setActiveModal(null)}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {auditLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No audit entries recorded yet.
              </div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '0.75rem', 
                        color: 'var(--indigo-primary)',
                        background: 'rgba(99, 102, 241, 0.12)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        {log.id}
                      </span>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                        {log.action.replace(/_/g, ' ')}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Target: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>{log.targetId}</span>
                      </span>
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {log.timestamp}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {log.details}
                  </p>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>Actor:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{log.actor}</strong>
                    <span>({log.role})</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setActiveModal(null)}>
            Close Trail
          </button>
        </div>

      </div>
    </div>
  );
}

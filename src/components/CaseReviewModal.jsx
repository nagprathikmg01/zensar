import React, { useState } from 'react';
import { useApp, formatINR } from '../context/AppContext';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  User, 
  MapPin, 
  Activity, 
  Lock,
  Smartphone
} from 'lucide-react';

export default function CaseReviewModal() {
  const { 
    selectedTransaction, 
    setSelectedTransactionId, 
    rules, 
    reviewCase,
    currentUser 
  } = useApp();

  const [notes, setNotes] = useState(selectedTransaction?.notes || '');
  const [submitting, setSubmitting] = useState(false);

  if (!selectedTransaction) return null;

  const handleAction = (decision) => {
    setSubmitting(true);
    reviewCase(selectedTransaction.id, decision, notes);
    setSubmitting(false);
    setSelectedTransactionId(null);
  };

  const triggeredRuleObjs = rules.filter(r => 
    selectedTransaction.triggeredRules.includes(r.id)
  );

  return (
    <div className="modal-backdrop" onClick={() => setSelectedTransactionId(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '860px' }}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2>
              <ShieldAlert size={22} color={selectedTransaction.status === 'BLOCKED' ? '#ef4444' : '#1d4ed8'} />
              <span>Incident Investigation: {selectedTransaction.id}</span>
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
              Logged: {selectedTransaction.timestamp} IST • Channel: {selectedTransaction.channel || 'UPI Instant'} • Status: <strong style={{ color: '#0f172a' }}>{selectedTransaction.status}</strong>
            </div>
          </div>
          <button className="close-btn" onClick={() => setSelectedTransactionId(null)}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">

          {/* Top Forensic Summary Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            background: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Transaction Amount</div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-headline)', color: '#0f172a', marginTop: '0.2rem' }}>
                {formatINR(selectedTransaction.amount)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#1d4ed8', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                Currency: INR (₹)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Threat Risk Score</div>
              <div style={{ 
                fontSize: '1.65rem', 
                fontWeight: 800, 
                fontFamily: 'var(--font-headline)', 
                color: selectedTransaction.riskScore >= 70 ? '#b91c1c' : (selectedTransaction.riskScore >= 40 ? '#b45309' : '#15803d'),
                marginTop: '0.2rem' 
              }}>
                {selectedTransaction.riskScore} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 100</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: selectedTransaction.riskScore >= 70 ? '#b91c1c' : (selectedTransaction.riskScore >= 40 ? '#b45309' : '#15803d'), fontWeight: 700 }}>
                {selectedTransaction.riskScore >= 70 ? '🚨 CRITICAL FRAUD ANOMALY' : (selectedTransaction.riskScore >= 40 ? '⚠️ ELEVATED REVIEW' : '✅ NON-FRAUD SAFE')}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Beneficiary / Merchant</div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginTop: '0.4rem' }}>
                {selectedTransaction.merchant}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 600 }}>
                MCC: {selectedTransaction.category}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Routing Location & IP</div>
              <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} color="#1d4ed8" />
                {selectedTransaction.location.city}, {selectedTransaction.location.country}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                IP: {selectedTransaction.location.ip}
              </div>
            </div>
          </div>

          {/* Section: Sender VPA Profile & Banking Baseline */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-headline)' }}>
              <User size={15} color="#1d4ed8" />
              Cardholder & Sender Account Profile
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{selectedTransaction.customer.name}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>UPI VPA Handle:</span>
                <div style={{ fontFamily: 'var(--font-mono)', color: '#1d4ed8', fontWeight: 700 }}>
                  {selectedTransaction.customer.vpa || selectedTransaction.customer.accountNumber}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Issuing Bank:</span>
                <div style={{ fontWeight: 600, color: '#334155' }}>{selectedTransaction.customer.bank || 'HDFC Bank'}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Monthly Spend Baseline:</span>
                <div style={{ fontWeight: 600, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                  {formatINR(selectedTransaction.customer.avgMonthlySpend)} / mo
                </div>
              </div>
            </div>
          </div>

          {/* Section: Detection Rules Breached */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-headline)' }}>
              <Activity size={15} color="#dc2626" />
              RBI & NPCI Policy Violation Analysis ({triggeredRuleObjs.length} Rules Tripped)
            </h3>

            {triggeredRuleObjs.length === 0 ? (
              <div style={{ color: '#15803d', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f0fdf4', padding: '0.75rem', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                <ShieldCheck size={16} />
                No proactive rules breached. Cleared by baseline NPCI real-time heuristic scan.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {triggeredRuleObjs.map(rule => (
                  <div 
                    key={rule.id}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderLeft: '4px solid #ef4444',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', color: '#b91c1c' }}>[{rule.id}]</span>
                        <span style={{ fontFamily: 'var(--font-headline)' }}>{rule.name}</span>
                        <span style={{ 
                          fontSize: '0.68rem', 
                          padding: '0.15rem 0.45rem', 
                          borderRadius: '3px', 
                          background: '#fee2e2',
                          color: '#b91c1c',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {rule.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#7f1d1d', marginTop: '0.2rem' }}>
                        {rule.description}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.7rem', color: '#991b1b' }}>Risk Contribution</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#b91c1c' }}>
                        +{rule.weight} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Threat Investigator Notes */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: '0.6rem', fontFamily: 'var(--font-headline)' }}>
              AML / CFT Investigator Rationale & Section 12 PMLA Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record forensic observation, cardholder contact record, or regulatory sanction details..."
              rows={3}
              style={{
                width: '100%',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-xs)',
                padding: '0.75rem',
                color: '#0f172a',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                resize: 'vertical'
              }}
            />
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
              Analyst: <strong>{currentUser ? currentUser.name : 'Vikramaditya Verma (Lead Threat Hunter)'}</strong> • Action logs permanently to RBI compliance archive.
            </div>
          </div>

          {/* Case Activity History */}
          {selectedTransaction.reviewHistory && selectedTransaction.reviewHistory.length > 0 && (
            <div style={{ padding: '0 0.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                Case Activity Timeline
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedTransaction.reviewHistory.map((h, idx) => (
                  <div key={idx} style={{ fontSize: '0.78rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{h.timestamp}</span>
                    <strong style={{ color: '#1d4ed8' }}>{h.reviewer}</strong>
                    <span>→ {h.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Actions */}
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setSelectedTransactionId(null)}
          >
            Cancel
          </button>

          {/* Action 1: Request Aadhaar OTP / KYC */}
          <button 
            type="button" 
            className="btn btn-warning"
            onClick={() => handleAction('REQUEST_KYC')}
            disabled={submitting}
          >
            <Clock size={14} />
            <span>Request Aadhaar OTP / Re-KYC</span>
          </button>

          {/* Action 2: Dismiss as Clear */}
          <button 
            type="button" 
            className="btn btn-success"
            onClick={() => handleAction('DISMISS_CLEAR')}
            disabled={submitting}
          >
            <ShieldCheck size={14} />
            <span>Dismiss (False Positive)</span>
          </button>

          {/* Action 3: Freeze UPI & Account */}
          <button 
            type="button" 
            className="btn btn-danger-action"
            onClick={() => handleAction('CONFIRM_FRAUD')}
            disabled={submitting}
          >
            <ShieldAlert size={15} />
            <span>🚨 Freeze UPI & Bank Account</span>
          </button>
        </div>

      </div>
    </div>
  );
}

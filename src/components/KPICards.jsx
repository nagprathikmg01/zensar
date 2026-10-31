import React from 'react';
import { useApp, formatIndianCompact, formatINR } from '../context/AppContext';
import { ShieldCheck, AlertTriangle, ShieldX, Cpu } from 'lucide-react';

export default function KPICards() {
  const { transactions, rules } = useApp();

  const totalVolume = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const flaggedCount = transactions.filter(tx => tx.status === 'FLAGGED' || tx.status === 'UNDER_REVIEW').length;
  const blockedAmount = transactions
    .filter(tx => tx.status === 'BLOCKED')
    .reduce((acc, tx) => acc + tx.amount, 0);
  const activeRulesCount = rules.filter(r => r.isEnabled).length;

  return (
    <div className="kpi-grid">
      {/* KPI 1 */}
      <div className="kpi-card">
        <div className="kpi-info">
          <h3>Total Volume Monitored</h3>
          <div className="kpi-value" style={{ color: 'var(--text-main)' }}>
            {formatIndianCompact(totalVolume)}
          </div>
          <div className="kpi-subtext">Across {transactions.length} processed Indian transactions</div>
        </div>
        <div className="kpi-icon-wrap kpi-icon-cyan">
          <ShieldCheck size={26} />
        </div>
      </div>

      {/* KPI 2 */}
      <div className="kpi-card">
        <div className="kpi-info">
          <h3>Suspicious Flagged Cases</h3>
          <div className="kpi-value" style={{ color: flaggedCount > 0 ? '#dc2626' : 'var(--text-main)' }}>
            {flaggedCount} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Alerts</span>
          </div>
          <div className="kpi-subtext">Under active AML/CFT investigation</div>
        </div>
        <div className="kpi-icon-wrap kpi-icon-red">
          <AlertTriangle size={26} />
        </div>
      </div>

      {/* KPI 3 */}
      <div className="kpi-card">
        <div className="kpi-info">
          <h3>Fraud Capital Blocked</h3>
          <div className="kpi-value" style={{ color: '#059669' }}>
            {formatIndianCompact(blockedAmount)}
          </div>
          <div className="kpi-subtext">Frozen Hawala & Mule transfers (PMLA Sec 12)</div>
        </div>
        <div className="kpi-icon-wrap kpi-icon-green">
          <ShieldX size={26} />
        </div>
      </div>

      {/* KPI 4 */}
      <div className="kpi-card">
        <div className="kpi-info">
          <h3>Active Prevention Rules</h3>
          <div className="kpi-value" style={{ color: '#b45309' }}>
            {activeRulesCount} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ {rules.length} Armed</span>
          </div>
          <div className="kpi-subtext">Real-time RBI & NPCI rule engine</div>
        </div>
        <div className="kpi-icon-wrap kpi-icon-saffron">
          <Cpu size={26} />
        </div>
      </div>
    </div>
  );
}

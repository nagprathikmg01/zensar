import React from 'react';
import { useApp, formatINR } from '../context/AppContext';
import { 
  Search, 
  ExternalLink, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  MapPin, 
  Smartphone,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export default function TransactionTable() {
  const { 
    transactions, 
    activeTab, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery, 
    categoryFilter, 
    setCategoryFilter,
    setSelectedTransactionId,
    highlightedTxId,
    isStreaming,
    streamCount
  } = useApp();

  const [viewMode, setViewMode] = React.useState('cards'); // 'cards' (Horizontal Bar Cards) or 'table' (Dense Table)
  const [copiedId, setCopiedId] = React.useState(null);

  const copyToClipboard = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Counts for tabs
  const countAll = transactions.length;
  const countFlagged = transactions.filter(t => t.status === 'FLAGGED').length;
  const countReview = transactions.filter(t => t.status === 'UNDER_REVIEW').length;
  const countBlocked = transactions.filter(t => t.status === 'BLOCKED').length;
  const countCleared = transactions.filter(t => t.status === 'CLEARED').length;

  // Filtering Logic
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'FLAGGED' && tx.status !== 'FLAGGED') return false;
    if (activeTab === 'UNDER_REVIEW' && tx.status !== 'UNDER_REVIEW') return false;
    if (activeTab === 'BLOCKED' && tx.status !== 'BLOCKED') return false;
    if (activeTab === 'CLEARED' && tx.status !== 'CLEARED') return false;

    if (categoryFilter !== 'ALL' && tx.category !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = tx.id.toLowerCase().includes(q);
      const matchCust = tx.customer.name.toLowerCase().includes(q);
      const matchVpa = tx.customer.vpa ? tx.customer.vpa.toLowerCase().includes(q) : false;
      const matchMerchant = tx.merchant.toLowerCase().includes(q);
      const matchLoc = `${tx.location.city} ${tx.location.country}`.toLowerCase().includes(q);
      if (!matchId && !matchCust && !matchVpa && !matchMerchant && !matchLoc) return false;
    }

    return true;
  });

  // Determines the row/card class and horizontal color bar based on transaction status
  const getStatusConfig = (status) => {
    switch (status) {
      case 'FLAGGED':
        return {
          cardClass: 'tx-card-fraud',
          rowClass: 'row-status-fraud',
          barColor: '#ef4444',
          label: 'CRITICAL FRAUD FLAGGED',
          badgeClass: 'badge-flagged',
          icon: <AlertOctagon size={13} />,
          dotColor: '#ef4444'
        };
      case 'BLOCKED':
        return {
          cardClass: 'tx-card-fraud',
          rowClass: 'row-status-fraud',
          barColor: '#ef4444',
          label: 'FRAUD ACCOUNT BLOCKED',
          badgeClass: 'badge-blocked',
          icon: <ShieldAlert size={13} />,
          dotColor: '#ef4444'
        };
      case 'UNDER_REVIEW':
        return {
          cardClass: 'tx-card-review',
          rowClass: 'row-status-review',
          barColor: '#f59e0b',
          label: 'SUSPICIOUS — UNDER REVIEW',
          badgeClass: 'badge-under-review',
          icon: <Clock size={13} />,
          dotColor: '#f59e0b'
        };
      case 'CLEARED':
      default:
        return {
          cardClass: 'tx-card-cleared',
          rowClass: 'row-status-cleared',
          barColor: '#10b981',
          label: 'NON-FRAUD (VERIFIED & SAFE)',
          badgeClass: 'badge-cleared',
          icon: <CheckCircle2 size={13} />,
          dotColor: '#10b981'
        };
    }
  };

  const getRiskMeter = (score) => {
    let color = '#10b981';
    let label = 'Low Risk';
    if (score >= 70) {
      color = '#ef4444';
      label = 'Critical Risk';
    } else if (score >= 40) {
      color = '#f59e0b';
      label = 'Moderate Risk';
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '110px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ fontWeight: 700, color: color }}>{score}/100</span>
          <span style={{ color: 'var(--text-muted)' }}>{label}</span>
        </div>
        <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 0.3s ease' }}></div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Streaming Live Banner (when active) */}
      {isStreaming && (
        <div className="stream-live-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="live-stream-pulse"></span>
            <span style={{ fontWeight: 700, color: '#1d4ed8', fontFamily: 'var(--font-headline)' }}>
              LIVE INDIAN UPI TELEMETRY ACTIVE:
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              Screening real-time interbank UPI payments against RBI & NPCI cyber defense rules (3–5s cadence)...
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#1d4ed8', background: '#eff6ff', padding: '0.2rem 0.65rem', borderRadius: '4px', border: '1px solid #bfdbfe', fontWeight: 700 }}>
            {streamCount} streamed transactions
          </div>
        </div>
      )}

      {/* Controls & Filter Bar */}
      <div className="control-bar">
        <div className="filter-tabs">
          <button
            className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveTab('ALL')}
          >
            <span>All Transactions</span>
            <span className="tab-badge">{countAll}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'FLAGGED' ? 'active' : ''}`}
            onClick={() => setActiveTab('FLAGGED')}
            style={countFlagged > 0 ? { color: '#dc2626' } : {}}
          >
            <span>🔴 Fraud Flagged</span>
            <span className="tab-badge" style={countFlagged > 0 ? { background: '#fee2e2', color: '#dc2626', fontWeight: 700 } : {}}>
              {countFlagged}
            </span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'UNDER_REVIEW' ? 'active' : ''}`}
            onClick={() => setActiveTab('UNDER_REVIEW')}
          >
            <span>🟡 Under Review</span>
            <span className="tab-badge">{countReview}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'BLOCKED' ? 'active' : ''}`}
            onClick={() => setActiveTab('BLOCKED')}
          >
            <span>🛑 Fraud Frozen</span>
            <span className="tab-badge">{countBlocked}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'CLEARED' ? 'active' : ''}`}
            onClick={() => setActiveTab('CLEARED')}
          >
            <span>🟢 Non-Fraud Cleared</span>
            <span className="tab-badge">{countCleared}</span>
          </button>
        </div>

        <div className="search-and-filters">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by UTR, UPI VPA (@okhdfcbank, @paytm), customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Channels</option>
            <option value="CRYPTO">Offshore Crypto Hawala</option>
            <option value="GAMBLING">Offshore Betting / Casinos</option>
            <option value="TRANSFER">P2P Wire / Mule Transfers</option>
            <option value="LUXURY">High-Value Luxury / Gold</option>
            <option value="RETAIL">E-Commerce Retail</option>
            <option value="GROCERY">Quick Commerce (Blinkit/Zepto)</option>
            <option value="FOOD_BEVERAGE">Food Delivery (Swiggy/Zomato)</option>
            <option value="TRAVEL">IRCTC & Travel</option>
          </select>

          {/* View Mode Toggle: Horizontal Bar Cards vs Dense Table */}
          <div className="view-mode-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Horizontal Bar Cards View"
            >
              <span>▤ Horizontal Bars</span>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Dense Data Table View"
            >
              <span>≡ Table View</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: HORIZONTAL BAR CARDS VIEW (Full Width Horizontal Bar per Transaction) */}
      {viewMode === 'cards' ? (
        <div className="horizontal-cards-container">
          {filteredTransactions.length === 0 ? (
            <div className="empty-state-card">
              No transactions match the selected filter criteria.
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const cfg = getStatusConfig(tx.status);
              const isNew = tx.id === highlightedTxId;

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTransactionId(tx.id)}
                  className={`tx-horizontal-bar-card ${cfg.cardClass} ${isNew ? 'row-stream-arrived' : ''}`}
                >
                  {/* Prominent Solid Horizontal Color Bar Across Entire Transaction */}
                  <div 
                    className="tx-full-horizontal-bar"
                    style={{ backgroundColor: cfg.barColor }}
                  />

                  {/* Card Content Row */}
                  <div className="tx-card-main-content">
                    {/* Left Section: Status Badge, UTR, Time, Customer & VPA */}
                    <div className="tx-card-col tx-card-col-identity">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span className={`badge ${cfg.badgeClass}`}>
                          {cfg.icon}
                          <span>{cfg.label}</span>
                        </span>
                        {isNew && <span className="new-tag-pill">STREAMED LIVE</span>}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                          {tx.id}
                        </span>
                        <button
                          onClick={(e) => copyToClipboard(tx.id, e)}
                          className="copy-btn-mini"
                          title="Copy UTR Reference"
                        >
                          {copiedId === tx.id ? '✓' : '⧉'}
                        </button>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          • {tx.timestamp} IST
                        </span>
                      </div>

                      <div style={{ marginTop: '0.4rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                          {tx.customer.name}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#1d4ed8', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {tx.customer.vpa || tx.customer.accountNumber}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {tx.customer.bank || 'Scheduled Commercial Bank'}
                        </div>
                      </div>
                    </div>

                    {/* Middle Section: Beneficiary, Merchant, Channel & Location */}
                    <div className="tx-card-col tx-card-col-routing">
                      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>
                        Beneficiary / Merchant
                      </div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.92rem', marginTop: '0.15rem' }}>
                        {tx.merchant}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                        Category: <strong style={{ color: '#334155' }}>{tx.category}</strong>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.85rem', marginTop: '0.45rem', fontSize: '0.75rem', color: '#475569' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Smartphone size={13} color="var(--text-muted)" />
                          <span>{tx.channel || 'UPI Instant'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={13} color="var(--text-muted)" />
                          <span>{tx.location.city}, {tx.location.country}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                          IP: {tx.location.ip}
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Amount (INR), Risk Gauge & Action Button */}
                    <div className="tx-card-col tx-card-col-actions">
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                          Transaction Value
                        </div>
                        <div className="amount-display-large">
                          {formatINR(tx.amount)}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {tx.amount >= 100000 ? `₹${(tx.amount / 100000).toFixed(2)} Lakhs` : 'Retail Cleared'}
                        </div>
                      </div>

                      <div style={{ alignSelf: 'flex-end', marginTop: '0.2rem' }}>
                        {getRiskMeter(tx.riskScore)}
                      </div>

                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', alignSelf: 'flex-end', marginTop: '0.4rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTransactionId(tx.id);
                        }}
                      >
                        <span>Investigate Case</span>
                        <ExternalLink size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* VIEW 2: DENSE DATA TABLE VIEW (Each Row has Red, Yellow, Green Horizontal Bar) */
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '4px', padding: 0 }}></th>
                <th>Txn UTR / Time (IST)</th>
                <th>Cardholder & Sender VPA</th>
                <th>Beneficiary / Merchant</th>
                <th>Channel & Routing</th>
                <th>Location & IP</th>
                <th>Amount (₹ INR)</th>
                <th>Risk Score</th>
                <th>Status Severity</th>
                <th>Investigation</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No transactions match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isNew = tx.id === highlightedTxId;
                  const cfg = getStatusConfig(tx.status);

                  return (
                    <tr 
                      key={tx.id} 
                      onClick={() => setSelectedTransactionId(tx.id)}
                      className={`${cfg.rowClass} ${isNew ? 'row-stream-arrived' : ''}`}
                    >
                      {/* Visual indicator cell */}
                      <td style={{ width: '4px', padding: 0 }}></td>

                      <td>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {isNew && <span className="new-tag-pill">NEW</span>}
                          <span>{tx.id}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                          {tx.timestamp} IST
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{tx.customer.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#1d4ed8', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {tx.customer.vpa || tx.customer.accountNumber}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {tx.customer.bank || 'Scheduled Commercial Bank'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{tx.merchant}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                          {tx.category}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.76rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Smartphone size={13} color="var(--text-muted)" />
                          <span>{tx.channel || 'UPI Instant'}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#334155' }}>
                          <MapPin size={13} color="var(--text-muted)" />
                          <span>{tx.location.city}, {tx.location.country}</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginLeft: '1.2rem' }}>
                          {tx.location.ip}
                        </div>
                      </td>
                      <td>
                        <div className="amount-display">
                          {formatINR(tx.amount)}
                        </div>
                      </td>
                      <td>
                        {getRiskMeter(tx.riskScore)}
                      </td>
                      <td>
                        <span className={`badge ${cfg.badgeClass}`}>
                          {cfg.icon}
                          <span>{cfg.label}</span>
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTransactionId(tx.id);
                          }}
                        >
                          <span>Investigate</span>
                          <ExternalLink size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

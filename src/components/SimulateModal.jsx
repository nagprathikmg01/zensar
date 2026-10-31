import React, { useState } from 'react';
import { useApp, formatINR } from '../context/AppContext';
import { X, Zap, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SimulateModal() {
  const { 
    activeModal, 
    setActiveModal, 
    addTransaction,
    setSelectedTransactionId
  } = useApp();

  const [mode, setMode] = useState('PRESET');
  
  // Custom Form State
  const [customerName, setCustomerName] = useState('Rajesh Deshmukh');
  const [vpa, setVpa] = useState('rajesh.d@oksbi');
  const [amount, setAmount] = useState(350000);
  const [merchant, setMerchant] = useState('Dubai Crypto Hawala Remit');
  const [category, setCategory] = useState('CRYPTO');
  const [city, setCity] = useState('Mumbai');
  const [country, setCountry] = useState('Foreign Proxy (Dubai)');

  if (activeModal !== 'SIMULATE') return null;

  const runScenario = (type) => {
    let txData = {};
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (type === 'HAWALA') {
      txData = {
        amount: 485000.00,
        currency: 'INR',
        channel: 'RTGS / IMPS Fast',
        merchant: 'Dubai Crypto Hawala P2P',
        category: 'CRYPTO',
        location: { city: 'Mumbai', country: 'Foreign Proxy (Dubai)', ip: '194.230.14.88' },
        customer: {
          id: 'CUST-IN-4091',
          name: 'Aman Kumar',
          vpa: 'aman.kumar@okhdfcbank',
          accountNumber: '**** **** 8192',
          bank: 'HDFC Bank',
          riskTier: 'HIGH',
          accountAgeMonths: 3,
          avgMonthlySpend: 45000
        }
      };
    } else if (type === 'VELOCITY') {
      txData = {
        amount: 49999.00,
        currency: 'INR',
        channel: 'UPI Instant P2P',
        merchant: 'Structured Hawala Mule Node #04',
        category: 'TRANSFER',
        location: { city: 'Bengaluru', country: 'India', ip: '115.112.8.45' },
        customer: {
          id: 'CUST-IN-1044',
          name: 'Priya Sharma',
          vpa: 'priya.sharma@okaxis',
          accountNumber: '**** **** 4019',
          bank: 'Axis Bank',
          riskTier: 'HIGH',
          accountAgeMonths: 24,
          avgMonthlySpend: 85000
        }
      };
    } else if (type === 'BETTING') {
      txData = {
        amount: 250000.00,
        currency: 'INR',
        channel: 'UPI NetBanking',
        merchant: 'Casino Goa Offshore Wallet',
        category: 'GAMBLING',
        location: { city: 'Pune', country: 'India', ip: '185.220.101.5' },
        timestamp: `${nowStr.split(' ')[0]} 03:22:15`,
        customer: {
          id: 'CUST-IN-6119',
          name: 'Sumit Vashisht',
          vpa: 'sumit.v@paytm',
          accountNumber: '**** **** 4910',
          bank: 'Paytm Payments Bank',
          riskTier: 'HIGH',
          accountAgeMonths: 9,
          avgMonthlySpend: 62000
        }
      };
    } else if (type === 'CLEAN_SPEND') {
      txData = {
        amount: 480.00,
        currency: 'INR',
        channel: 'UPI AutoPay',
        merchant: 'Swiggy Instamart Delivery',
        category: 'FOOD_BEVERAGE',
        location: { city: 'Pune', country: 'India', ip: '49.206.12.89' },
        customer: {
          id: 'CUST-IN-5510',
          name: 'Rohit Mehta',
          vpa: 'rohit.m@okicici',
          accountNumber: '**** **** 1290',
          bank: 'ICICI Bank',
          riskTier: 'LOW',
          accountAgeMonths: 36,
          avgMonthlySpend: 54000
        }
      };
    }

    const createdTx = addTransaction(txData);
    setActiveModal(null);
    if (createdTx.status === 'FLAGGED' || createdTx.status === 'UNDER_REVIEW') {
      setSelectedTransactionId(createdTx.id);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const createdTx = addTransaction({
      amount: parseFloat(amount),
      currency: 'INR',
      merchant,
      category,
      channel: 'UPI Instant',
      location: { city, country, ip: '103.211.54.' + Math.floor(Math.random() * 255) },
      customer: {
        id: `CUST-IN-${Math.floor(1000 + Math.random() * 9000)}`,
        name: customerName,
        vpa,
        accountNumber: `**** **** ${Math.floor(1000 + Math.random() * 9000)}`,
        bank: 'State Bank of India',
        riskTier: 'MEDIUM',
        accountAgeMonths: 14,
        avgMonthlySpend: 65000
      }
    });

    setActiveModal(null);
    if (createdTx.status === 'FLAGGED' || createdTx.status === 'UNDER_REVIEW') {
      setSelectedTransactionId(createdTx.id);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '740px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>
              <Zap size={22} color="#1d4ed8" />
              <span>Real-Time Threat & UPI Simulator</span>
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
              Test how Sentinel screens live UPI and RTGS attacks against Indian cyber defense policies
            </div>
          </div>
          <button className="close-btn" onClick={() => setActiveModal(null)}>
            <X size={20} />
          </button>
        </div>

        {/* Mode Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: '#f8fafc' }}>
          <button
            onClick={() => setMode('PRESET')}
            style={{
              flex: 1,
              padding: '0.85rem',
              background: mode === 'PRESET' ? '#ffffff' : 'transparent',
              color: mode === 'PRESET' ? '#1d4ed8' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: mode === 'PRESET' ? '2px solid #1d4ed8' : 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-headline)'
            }}
          >
            ⚡ One-Click Indian Attack Vectors
          </button>
          <button
            onClick={() => setMode('CUSTOM')}
            style={{
              flex: 1,
              padding: '0.85rem',
              background: mode === 'CUSTOM' ? '#ffffff' : 'transparent',
              color: mode === 'CUSTOM' ? '#1d4ed8' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: mode === 'CUSTOM' ? '2px solid #1d4ed8' : 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-headline)'
            }}
          >
            🛠️ Custom UPI Transaction Builder
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {mode === 'PRESET' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              
              {/* Scenario 1: Dubai Crypto Hawala */}
              <button
                type="button"
                onClick={() => runScenario('HAWALA')}
                style={{
                  width: '100%',
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  textAlign: 'left',
                  border: '1px solid #fecaca',
                  borderLeft: '5px solid #ef4444',
                  background: '#fef2f2',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', width: '100%' }}>
                  <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: 'var(--font-headline)' }}>
                    <ShieldAlert size={17} color="#ef4444" style={{ flexShrink: 0 }} />
                    <span>Dubai Crypto Hawala Wire (₹4,85,000.00)</span>
                  </div>
                  <span className="badge badge-flagged" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>Critical Anomaly</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#7f1d1d', lineHeight: '1.4', paddingLeft: '1.45rem' }}>
                  Foreign proxy wire to offshore broker from aman.kumar@okhdfcbank. Exceeds ₹2 Lakh threshold and trips Hawala filter.
                </div>
              </button>

              {/* Scenario 2: Velocity Bot Swiping */}
              <button
                type="button"
                onClick={() => runScenario('VELOCITY')}
                style={{
                  width: '100%',
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  textAlign: 'left',
                  border: '1px solid #fde68a',
                  borderLeft: '5px solid #f59e0b',
                  background: '#fffbeb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', width: '100%' }}>
                  <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: 'var(--font-headline)' }}>
                    <AlertTriangle size={17} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <span>Rapid UPI Structuring Spike (₹49,999.00)</span>
                  </div>
                  <span className="badge badge-under-review" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>Velocity Flag</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#78350f', lineHeight: '1.4', paddingLeft: '1.45rem' }}>
                  4th rapid UPI payment under ₹50k limit within 90 seconds. Breaches velocity threshold (&gt;3 tx/3m).
                </div>
              </button>

              {/* Scenario 3: Off-hours Goa Betting */}
              <button
                type="button"
                onClick={() => runScenario('BETTING')}
                style={{
                  width: '100%',
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  textAlign: 'left',
                  border: '1px solid #fecaca',
                  borderLeft: '5px solid #ef4444',
                  background: '#fef2f2',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', width: '100%' }}>
                  <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: 'var(--font-headline)' }}>
                    <ShieldAlert size={17} color="#ef4444" style={{ flexShrink: 0 }} />
                    <span>Midnight Offshore Casino Remittance (₹2,50,000.00)</span>
                  </div>
                  <span className="badge badge-flagged" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>PMLA Alert</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#7f1d1d', lineHeight: '1.4', paddingLeft: '1.45rem' }}>
                  Executed at 03:22 AM IST from Pune to an offshore betting wallet. Breaches High-Value and PMLA directives.
                </div>
              </button>

              {/* Scenario 4: Clean Everyday Spend */}
              <button
                type="button"
                onClick={() => runScenario('CLEAN_SPEND')}
                style={{
                  width: '100%',
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  textAlign: 'left',
                  border: '1px solid #bbf7d0',
                  borderLeft: '5px solid #10b981',
                  background: '#f0fdf4',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', width: '100%' }}>
                  <div style={{ fontWeight: 700, color: '#065f46', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: 'var(--font-headline)' }}>
                    <CheckCircle2 size={17} color="#10b981" style={{ flexShrink: 0 }} />
                    <span>Verified Swiggy Food &amp; Grocery Order (₹480.00)</span>
                  </div>
                  <span className="badge badge-cleared" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>NPCI Verified</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#047857', lineHeight: '1.4', paddingLeft: '1.45rem' }}>
                  Normal daily consumer spend authenticated with biometric UPI PIN in home city (Pune).
                </div>
              </button>

            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    className="auth-input"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Sender UPI VPA
                  </label>
                  <input
                    type="text"
                    className="auth-input"
                    value={vpa}
                    onChange={(e) => setVpa(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    step="100"
                    className="auth-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Beneficiary / Merchant Category
                  </label>
                  <select
                    className="auth-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="TRANSFER">P2P Wire / Mule Transfer</option>
                    <option value="CRYPTO">Offshore Crypto Hawala</option>
                    <option value="GAMBLING">Offshore Casino / Betting</option>
                    <option value="LUXURY">Tanishq Jewellery / Gold</option>
                    <option value="RETAIL">E-Commerce Retail</option>
                    <option value="FOOD_BEVERAGE">Swiggy / Zomato</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Origin City
                  </label>
                  <input
                    type="text"
                    className="auth-input"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Routing Country / Proxy
                  </label>
                  <input
                    type="text"
                    className="auth-input"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
                <span>Inject & Screen Indian Transaction Live</span>
                <Zap size={16} />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

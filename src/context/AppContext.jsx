import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_RULES, INITIAL_TRANSACTIONS, INITIAL_AUDIT_LOGS, DEMO_USERS } from '../data/mockData';
import { generateStreamedTransaction, generateExplicitAttackPayload } from '../services/streamService';

const AppContext = createContext();

// Helper to format currency in Indian Rupees with Lakhs & Crores formatting
export const formatINR = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

// Compact Indian format for large values (e.g. ₹48.5 Crore, ₹3.4 Lakh)
export const formatIndianCompact = (val) => {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  } else if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakh`;
  }
  return formatINR(val);
};

export function AppProvider({ children }) {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('fraudalert_in_user');
    return saved ? JSON.parse(saved) : null;
  });

  // App Data State (stored with indian namespace)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('fraudalert_in_txs');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem('fraudalert_in_rules');
    return saved ? JSON.parse(saved) : INITIAL_RULES;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('fraudalert_in_audits');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // UI Navigation & Filters
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, FLAGGED, UNDER_REVIEW, BLOCKED, CLEARED
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'SIMULATE', 'RULES', 'AUDIT', null

  // Live Streaming Engine State
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamCount, setStreamCount] = useState(0);
  const [highlightedTxId, setHighlightedTxId] = useState(null);
  const streamTimerRef = useRef(null);

  // Reference to latest state for async streaming
  const rulesRef = useRef(rules);
  const transactionsRef = useRef(transactions);
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    rulesRef.current = rules;
  }, [rules]);

  useEffect(() => {
    transactionsRef.current = transactions;
  }, [transactions]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Toast Notification System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('fraudalert_in_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fraudalert_in_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('fraudalert_in_audits', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fraudalert_in_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('fraudalert_in_user');
    }
  }, [currentUser]);

  // Auth Functions
  const login = (user) => {
    setCurrentUser(user);
    showToast(`Session Authenticated: ${user.name} • ${user.badge}`, 'success');
  };

  const logout = () => {
    setIsStreaming(false);
    setCurrentUser(null);
    setSelectedTransactionId(null);
    setActiveModal(null);
    showToast('Securely logged out of Indian BFSI Sentinel SOC', 'info');
  };

  // Dynamic Rule Evaluation Engine — produces diverse, realistic risk scores across 5–99
  const evaluateTransaction = (tx, activeRules = rulesRef.current, existingTxs = transactionsRef.current) => {
    const triggeredRules = [];
    // Base noise: 5–15 for clean tx, gives natural spread
    let calculatedRiskScore = Math.floor(Math.random() * 11) + 5;

    const ruleMap = {};
    activeRules.forEach(r => { ruleMap[r.id] = r; });

    // Jitter helper: adds ±20% randomness to every rule weight so scores vary each time
    const jitter = (weight) => Math.round(weight * (0.80 + Math.random() * 0.40));

    // Rule 1: High-Value Threshold (Whale Limit in ₹)
    const maxAmountRule = ruleMap['RULE-101'];
    if (maxAmountRule && maxAmountRule.isEnabled) {
      if (tx.amount >= maxAmountRule.threshold) {
        triggeredRules.push(maxAmountRule.id);
        calculatedRiskScore += jitter(maxAmountRule.weight);
      } else if (tx.amount >= maxAmountRule.threshold * 0.6) {
        // Partial score for near-whale amounts (60–99% of limit)
        const proximity = (tx.amount - maxAmountRule.threshold * 0.6) / (maxAmountRule.threshold * 0.4);
        calculatedRiskScore += Math.round(jitter(maxAmountRule.weight) * 0.35 * proximity);
      }
    }

    // Rule 2: Rapid UPI Velocity (only checks last 30 transactions to avoid always-flagging)
    const velocityRule = ruleMap['RULE-102'];
    if (velocityRule && velocityRule.isEnabled) {
      const recentWindow = existingTxs.slice(0, 30);
      const recentCustomerTxs = recentWindow.filter(t => t.customer.id === tx.customer.id).length;
      if (recentCustomerTxs >= velocityRule.threshold) {
        triggeredRules.push(velocityRule.id);
        calculatedRiskScore += jitter(velocityRule.weight);
      } else if (recentCustomerTxs >= Math.max(2, velocityRule.threshold - 2)) {
        // Near-velocity partial score
        calculatedRiskScore += Math.round(jitter(velocityRule.weight) * 0.4);
      }
    }

    // Rule 3: Off-Hours (02:00–05:00 IST) — exact match only, no partial
    const offHoursRule = ruleMap['RULE-103'];
    if (offHoursRule && offHoursRule.isEnabled) {
      const txHour = new Date(tx.timestamp.replace(' ', 'T')).getHours();
      if (txHour >= 2 && txHour <= 5) {
        triggeredRules.push(offHoursRule.id);
        calculatedRiskScore += jitter(offHoursRule.weight);
      } else if (txHour === 1 || txHour === 6) {
        // Adjacent hours: slight bump
        calculatedRiskScore += Math.round(jitter(offHoursRule.weight) * 0.25);
      }
    }

    // Rule 4: High-Risk Foreign Geo-Hop & Hawala Proxy
    const geoRule = ruleMap['RULE-104'];
    if (geoRule && geoRule.isEnabled) {
      const highRiskMarkers = ['Dubai', 'UAE', 'Bangkok', 'Thailand', 'Lagos', 'Nigeria', 'Ukraine', 'Proxy', 'Cyprus', 'Malta'];
      const mediumRiskMarkers = ['Seychelles', 'Mauritius', 'Singapore', 'Hong Kong'];
      const locStr = `${tx.location.city} ${tx.location.country}`.toLowerCase();
      if (highRiskMarkers.some(m => locStr.includes(m.toLowerCase()))) {
        triggeredRules.push(geoRule.id);
        calculatedRiskScore += jitter(geoRule.weight);
      } else if (mediumRiskMarkers.some(m => locStr.includes(m.toLowerCase()))) {
        calculatedRiskScore += Math.round(jitter(geoRule.weight) * 0.45);
      }
    }

    // Rule 5: Restricted MCC (Betting / Offshore Crypto Hawala)
    const merchantRule = ruleMap['RULE-105'];
    if (merchantRule && merchantRule.isEnabled) {
      if (['CRYPTO', 'GAMBLING'].includes(tx.category)) {
        triggeredRules.push(merchantRule.id);
        calculatedRiskScore += jitter(merchantRule.weight);
      } else if (['TRANSFER', 'LUXURY'].includes(tx.category)) {
        // Medium-risk categories get partial score
        calculatedRiskScore += Math.round(jitter(merchantRule.weight) * 0.30);
      }
    }

    // Cap risk score between 5 and 99
    calculatedRiskScore = Math.min(99, Math.max(calculatedRiskScore, 5));

    // Determine Status — calibrated thresholds
    let status = 'CLEARED';
    if (calculatedRiskScore >= 68 || triggeredRules.length >= 3) {
      status = 'FLAGGED';
    } else if (calculatedRiskScore >= 38 || triggeredRules.length >= 1) {
      status = 'UNDER_REVIEW';
    }

    return { triggeredRules, riskScore: calculatedRiskScore, status };
  };

  // Add / Ingest a New Transaction
  const addTransaction = (rawTx, options = {}) => {
    const { fromStream = false, isExplicitAttack = false } = options;
    const evaluation = evaluateTransaction(rawTx, rulesRef.current, transactionsRef.current);

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newTx = {
      ...rawTx,
      id: rawTx.id || `UTR-${Math.floor(800000000 + Math.random() * 199999999)}`,
      timestamp: rawTx.timestamp || nowStr,
      channel: rawTx.channel || 'UPI Instant',
      currency: 'INR',
      status: evaluation.status,
      riskScore: evaluation.riskScore,
      triggeredRules: evaluation.triggeredRules,
      notes: evaluation.triggeredRules.length > 0
        ? `Breached ${evaluation.triggeredRules.length} RBI/NPCI cyber policy rule(s): ${evaluation.triggeredRules.join(', ')}`
        : 'Automated heuristics cleared transaction under NPCI real-time baseline.',
      assignedTo: evaluation.status === 'FLAGGED' ? (currentUserRef.current ? currentUserRef.current.name : null) : null,
      reviewHistory: [
        {
          timestamp: nowStr,
          action: evaluation.status === 'CLEARED' ? 'AUTO_APPROVED' : 'SYSTEM_FLAGGED',
          reviewer: 'Sentinel v4 Engine',
          note: evaluation.status === 'CLEARED' ? 'Passed all NPCI heuristics' : `Risk score ${evaluation.riskScore}/100. Breached active thresholds.`
        }
      ]
    };

    setTransactions(prev => [newTx, ...prev.slice(0, 59)]);

    // Highlight row briefly
    setHighlightedTxId(newTx.id);
    setTimeout(() => {
      setHighlightedTxId(null);
    }, 2800);

    // Notifications & Audit Trail
    if (newTx.status === 'FLAGGED' || newTx.status === 'UNDER_REVIEW') {
      const toastType = newTx.riskScore >= 75 ? 'error' : 'warning';
      showToast(
        `🚨 ${fromStream ? 'Live UPI Alert' : 'Threat Intercepted'}: ${newTx.id} (${formatINR(newTx.amount)}) FLAGGED [Risk: ${newTx.riskScore}/100]`,
        toastType
      );

      const auditEntry = {
        id: `AUDIT-${Date.now().toString().slice(-4)}`,
        timestamp: nowStr,
        actor: 'Sentinel UPI Stream Guard',
        role: 'Autonomous Defense',
        action: 'TRANSACTION_FLAGGED',
        targetId: newTx.id,
        details: `Live evaluation: ${formatINR(newTx.amount)} via ${newTx.channel} at ${newTx.merchant} breached rules (${evaluation.triggeredRules.join(', ') || 'Heuristics'}). Risk: ${newTx.riskScore}/100.`
      };
      setAuditLogs(prev => [auditEntry, ...prev.slice(0, 79)]);
    } else if (!fromStream) {
      showToast(`✅ Payment ${newTx.id} (${formatINR(newTx.amount)}) Verified & Cleared.`, 'success');
    }

    if (isExplicitAttack) {
      setSelectedTransactionId(newTx.id);
    }

    return newTx;
  };

  // Live Stream Interval Loop (every 3 to 5 seconds)
  useEffect(() => {
    if (!isStreaming) {
      if (streamTimerRef.current) {
        clearTimeout(streamTimerRef.current);
        streamTimerRef.current = null;
      }
      return;
    }

    const scheduleNextTick = () => {
      const nextDelay = Math.floor(Math.random() * 2000) + 3000;

      streamTimerRef.current = setTimeout(() => {
        const payload = generateStreamedTransaction();
        addTransaction(payload, { fromStream: true });
        setStreamCount(prev => prev + 1);
        scheduleNextTick();
      }, nextDelay);
    };

    scheduleNextTick();

    return () => {
      if (streamTimerRef.current) {
        clearTimeout(streamTimerRef.current);
        streamTimerRef.current = null;
      }
    };
  }, [isStreaming]);

  const toggleStream = () => {
    setIsStreaming(prev => {
      const next = !prev;
      showToast(
        next ? '🟢 Live UPI transaction stream armed (3–5s cadence)' : '⏸️ UPI transaction stream paused',
        next ? 'success' : 'info'
      );
      return next;
    });
  };

  const injectLiveAttack = () => {
    const payload = generateExplicitAttackPayload();
    const createdTx = addTransaction(payload, { fromStream: true, isExplicitAttack: true });
    showToast(`⚡ Injected Critical Hawala Attack: ${createdTx.id} (${formatINR(createdTx.amount)})`, 'error');
    return createdTx;
  };

  // Update Rule Configuration
  const updateRule = (ruleId, updates) => {
    setRules(prevRules => {
      const updated = prevRules.map(r => (r.id === ruleId ? { ...r, ...updates } : r));
      return updated;
    });

    const rule = rules.find(r => r.id === ruleId);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const auditEntry = {
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: nowStr,
      actor: currentUser ? currentUser.name : 'Authorized Admin',
      role: currentUser ? currentUser.role : 'System Admin',
      action: 'RULE_UPDATED',
      targetId: ruleId,
      details: `RBI/NPCI Rule "${rule?.name}" modified: ${JSON.stringify(updates)}`
    };

    setAuditLogs(prev => [auditEntry, ...prev]);
    showToast(`Policy threshold updated: ${rule?.name}`, 'info');
  };

  // Review Case Action
  const reviewCase = (transactionId, decision, reviewerNotes) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const reviewerName = currentUser ? currentUser.name : 'Vikramaditya Verma';

    let newStatus = 'CLEARED';
    let actionLabel = 'APPROVED_BY_ANALYST';

    if (decision === 'CONFIRM_FRAUD') {
      newStatus = 'BLOCKED';
      actionLabel = 'UPI_VPA_AND_ACCOUNT_FROZEN';
    } else if (decision === 'DISMISS_CLEAR') {
      newStatus = 'CLEARED';
      actionLabel = 'CLEARED_FALSE_POSITIVE';
    } else if (decision === 'REQUEST_KYC') {
      newStatus = 'UNDER_REVIEW';
      actionLabel = 'AADHAAR_OTP_RE_KYC_REQUESTED';
    }

    setTransactions(prev =>
      prev.map(tx => {
        if (tx.id === transactionId) {
          return {
            ...tx,
            status: newStatus,
            notes: reviewerNotes || tx.notes,
            assignedTo: reviewerName,
            reviewHistory: [
              ...tx.reviewHistory,
              {
                timestamp: nowStr,
                action: actionLabel,
                reviewer: reviewerName,
                note: reviewerNotes || `Case resolved as ${newStatus}`
              }
            ]
          };
        }
        return tx;
      })
    );

    // Audit Log Entry
    const auditEntry = {
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      timestamp: nowStr,
      actor: reviewerName,
      role: currentUser ? currentUser.role : 'AML Threat Hunter',
      action: actionLabel,
      targetId: transactionId,
      details: reviewerNotes || `Resolution updated to ${newStatus} under Section 12 PMLA`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    showToast(`Case ${transactionId} updated to: ${newStatus}`, decision === 'CONFIRM_FRAUD' ? 'error' : 'success');
  };

  // Reset to Baseline Data
  const resetDatabase = () => {
    setIsStreaming(false);
    setStreamCount(0);
    setHighlightedTxId(null);
    setTransactions(INITIAL_TRANSACTIONS);
    setRules(INITIAL_RULES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.removeItem('fraudalert_in_txs');
    localStorage.removeItem('fraudalert_in_rules');
    localStorage.removeItem('fraudalert_in_audits');
    showToast('Database restored to clean Indian BFSI baseline.', 'info');
  };

  const selectedTransaction = transactions.find(t => t.id === selectedTransactionId) || null;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        transactions,
        rules,
        auditLogs,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        selectedTransactionId,
        setSelectedTransactionId,
        selectedTransaction,
        activeModal,
        setActiveModal,
        addTransaction,
        updateRule,
        reviewCase,
        resetDatabase,
        toast,
        showToast,
        demoUsers: DEMO_USERS,
        // Streaming Service
        isStreaming,
        toggleStream,
        streamCount,
        highlightedTxId,
        injectLiveAttack
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Indian BFSI & UPI Configurable Detection Rules (Calibrated in INR ₹)
export const INITIAL_RULES = [
  {
    id: 'RULE-101',
    name: 'High-Value Outlier (Whale Limit)',
    description: 'Flags any single transaction exceeding the defined high-value threshold (RBI RTGS/IMPS Monitoring).',
    category: 'AMOUNT',
    type: 'MAX_AMOUNT',
    threshold: 200000, // ₹2,00,000
    unit: '₹',
    min: 25000,
    max: 1500000,
    step: 25000,
    severity: 'CRITICAL',
    weight: 45,
    isEnabled: true,
  },
  {
    id: 'RULE-102',
    name: 'Rapid UPI Swiping Velocity',
    description: 'Flags account handles with rapid repeated transfers in under 3 minutes (potential bot/SIM-swap drain).',
    category: 'VELOCITY',
    type: 'VELOCITY_COUNT',
    threshold: 3,
    unit: 'UPI tx / 3m',
    min: 2,
    max: 8,
    step: 1,
    severity: 'HIGH',
    weight: 35,
    isEnabled: true,
  },
  {
    id: 'RULE-103',
    name: 'Off-Hours Anomalous Transfer',
    description: 'Flags high-value wire and UPI transfers initiated between 02:00 AM and 05:00 AM IST.',
    category: 'TIME',
    type: 'OFF_HOURS',
    threshold: 1,
    unit: '02:00-05:00 IST',
    severity: 'MEDIUM',
    weight: 25,
    isEnabled: true,
  },
  {
    id: 'RULE-104',
    name: 'High-Risk Geo-Hop & Hawala Proxy',
    description: 'Flags transactions originating from known mule proxy IPs or rapid international jumps (Dubai, Bangkok, Lagos).',
    category: 'GEO',
    type: 'GEO_ANOMALY',
    threshold: 1,
    unit: 'Proxy & Hawala List',
    severity: 'CRITICAL',
    weight: 50,
    isEnabled: true,
  },
  {
    id: 'RULE-105',
    name: 'Offshore Betting & Crypto P2P (PMLA Risk)',
    description: 'Applies critical risk weights to illegal offshore gaming platforms, casino wallets, and crypto P2P aggregators.',
    category: 'MERCHANT',
    type: 'MERCHANT_RISK',
    threshold: 1,
    unit: 'Restricted MCC',
    severity: 'CRITICAL',
    weight: 40,
    isEnabled: true,
  }
];

// Pre-seeded Real-Time Indian Banking & UPI Transactions Dataset
export const INITIAL_TRANSACTIONS = [
  {
    id: 'UTR-884920194',
    timestamp: '2026-10-31 14:32:08',
    channel: 'UPI / IMPS',
    customer: {
      id: 'CUST-IN-4091',
      name: 'Aman Kumar',
      vpa: 'aman.kumar@okhdfcbank',
      accountNumber: '**** **** 8192',
      riskTier: 'HIGH',
      accountAgeMonths: 3,
      avgMonthlySpend: 45000,
      bank: 'HDFC Bank'
    },
    amount: 485000.00,
    currency: 'INR',
    merchant: 'Dubai Crypto Hawala P2P',
    category: 'CRYPTO',
    location: { city: 'Mumbai', country: 'Foreign Proxy (Dubai)', ip: '194.230.14.88' },
    status: 'FLAGGED',
    riskScore: 98,
    triggeredRules: ['RULE-101', 'RULE-104', 'RULE-105'],
    notes: 'Exceeds ₹2 Lakh threshold, originating from Dubai proxy IP to restricted crypto Hawala hub. NPCI Mule Registry Flag.',
    assignedTo: 'Vikramaditya Verma',
    reviewHistory: [
      { timestamp: '2026-10-31 14:32:09', action: 'SYSTEM_FLAGGED', reviewer: 'Sentinel v4 Engine', note: 'Tripped High-Value, Foreign Proxy, and Restricted MCC rules.' }
    ]
  },
  {
    id: 'UTR-884920188',
    timestamp: '2026-10-31 14:31:54',
    channel: 'Credit Card POS',
    customer: {
      id: 'CUST-IN-1044',
      name: 'Priya Sharma',
      vpa: 'priya.sharma@okaxis',
      accountNumber: '**** **** 4019',
      riskTier: 'MEDIUM',
      accountAgeMonths: 24,
      avgMonthlySpend: 85000,
      bank: 'Axis Bank'
    },
    amount: 240000.00,
    currency: 'INR',
    merchant: 'Tanishq Jewellery Indiranagar',
    category: 'LUXURY',
    location: { city: 'Bengaluru', country: 'India', ip: '115.112.8.45' },
    status: 'UNDER_REVIEW',
    riskScore: 74,
    triggeredRules: ['RULE-101'],
    notes: 'Single transaction of ₹2,40,000 exceeds ₹2 Lakh threshold on jewellery retail MCC.',
    assignedTo: 'Ananya Iyer',
    reviewHistory: [
      { timestamp: '2026-10-31 14:31:55', action: 'SYSTEM_FLAGGED', reviewer: 'Sentinel v4 Engine', note: 'High value threshold breached.' },
      { timestamp: '2026-10-31 14:32:20', action: 'ASSIGNED', reviewer: 'Ananya Iyer', note: 'Queued for cardholder phone verification.' }
    ]
  },
  {
    id: 'UTR-884920162',
    timestamp: '2026-10-31 14:31:40',
    channel: 'UPI NetBanking',
    customer: {
      id: 'CUST-IN-6119',
      name: 'Sumit Vashisht',
      vpa: 'sumit.v@paytm',
      accountNumber: '**** **** 4910',
      riskTier: 'HIGH',
      accountAgeMonths: 9,
      avgMonthlySpend: 62000,
      bank: 'State Bank of India'
    },
    amount: 150000.00,
    currency: 'INR',
    merchant: 'Casino Goa Offshore Wallet',
    category: 'GAMBLING',
    location: { city: 'Pune', country: 'India', ip: '185.220.101.5' },
    status: 'FLAGGED',
    riskScore: 91,
    triggeredRules: ['RULE-105'],
    notes: 'Known offshore betting syndicate gateway flagged under RBI PMLA directives.',
    assignedTo: null,
    reviewHistory: [
      { timestamp: '2026-10-31 14:31:41', action: 'SYSTEM_FLAGGED', reviewer: 'Sentinel v4 Engine', note: 'Restricted betting MCC blacklist match.' }
    ]
  },
  {
    id: 'UTR-884920145',
    timestamp: '2026-10-31 14:31:12',
    channel: 'UPI Instant',
    customer: {
      id: 'CUST-IN-8812',
      name: 'Neha Roy',
      vpa: 'neha.r@oksbi',
      accountNumber: '**** **** 5521',
      riskTier: 'LOW',
      accountAgeMonths: 48,
      avgMonthlySpend: 92000,
      bank: 'State Bank of India'
    },
    amount: 1420.00,
    currency: 'INR',
    merchant: 'Blinkit Quick Commerce',
    category: 'GROCERY',
    location: { city: 'Delhi NCR', country: 'India', ip: '73.180.44.12' },
    status: 'CLEARED',
    riskScore: 12,
    triggeredRules: [],
    notes: 'Standard verified grocery purchase within registered residential location.',
    assignedTo: null,
    reviewHistory: [
      { timestamp: '2026-10-31 14:31:12', action: 'AUTO_APPROVED', reviewer: 'Sentinel v4 Engine', note: 'Whitelisted merchant & biometric UPI PIN authenticated.' }
    ]
  },
  {
    id: 'UTR-884920130',
    timestamp: '2026-10-31 14:30:58',
    channel: 'UPI Instant',
    customer: {
      id: 'CUST-IN-5510',
      name: 'Rohit Mehta',
      vpa: 'rohit.m@okicici',
      accountNumber: '**** **** 1290',
      riskTier: 'LOW',
      accountAgeMonths: 36,
      avgMonthlySpend: 54000,
      bank: 'ICICI Bank'
    },
    amount: 890.00,
    currency: 'INR',
    merchant: 'Swiggy Instamart Delivery',
    category: 'FOOD_BEVERAGE',
    location: { city: 'Mumbai', country: 'India', ip: '67.165.88.20' },
    status: 'CLEARED',
    riskScore: 8,
    triggeredRules: [],
    notes: 'Everyday meal order authenticated with 2FA token.',
    assignedTo: null,
    reviewHistory: [
      { timestamp: '2026-10-31 14:30:58', action: 'AUTO_APPROVED', reviewer: 'Sentinel v4 Engine', note: 'Low value trusted merchant.' }
    ]
  },
  {
    id: 'UTR-884920112',
    timestamp: '2026-10-31 14:30:25',
    channel: 'IMPS Fast Transfer',
    customer: {
      id: 'CUST-IN-9921',
      name: 'Mule Account Cluster #04',
      vpa: 'mule_node_99@ibl',
      accountNumber: '**** **** 3341',
      riskTier: 'HIGH',
      accountAgeMonths: 1,
      avgMonthlySpend: 15000,
      bank: 'IndusInd Bank'
    },
    amount: 99999.00,
    currency: 'INR',
    merchant: 'Anonymous P2P Remit',
    category: 'TRANSFER',
    location: { city: 'Delhi NCR', country: 'India', ip: '103.211.54.12' },
    status: 'BLOCKED',
    riskScore: 95,
    triggeredRules: ['RULE-102', 'RULE-104'],
    notes: 'Rapid structuring below ₹1 Lakh limit across 5 newly created UPI VPAs within 90 seconds.',
    assignedTo: 'Vikramaditya Verma',
    reviewHistory: [
      { timestamp: '2026-10-31 14:30:26', action: 'SYSTEM_FLAGGED', reviewer: 'Sentinel v4 Engine', note: 'Mule Ring Velocity anomaly identified.' },
      { timestamp: '2026-10-31 14:31:00', action: 'CONFIRMED_FRAUD', reviewer: 'Vikramaditya Verma', note: 'Account frozen under Section 12 PMLA and reported to Cyber Crime cell.' }
    ]
  },
  {
    id: 'UTR-884920088',
    timestamp: '2026-10-31 14:28:10',
    channel: 'UPI P2P',
    customer: {
      id: 'CUST-IN-2299',
      name: 'Sneha Kulkarni',
      vpa: 'sneha.k@okhdfcbank',
      accountNumber: '**** **** 6772',
      riskTier: 'LOW',
      accountAgeMonths: 52,
      avgMonthlySpend: 78000,
      bank: 'HDFC Bank'
    },
    amount: 3250.00,
    currency: 'INR',
    merchant: 'IRCTC Rail E-Tickets',
    category: 'TRAVEL',
    location: { city: 'Pune', country: 'India', ip: '24.60.10.89' },
    status: 'CLEARED',
    riskScore: 5,
    triggeredRules: [],
    notes: 'Government verified travel booking portal.',
    assignedTo: null,
    reviewHistory: [
      { timestamp: '2026-10-31 14:28:10', action: 'AUTO_APPROVED', reviewer: 'Sentinel v4 Engine', note: 'Verified institutional beneficiary.' }
    ]
  }
];

// Demo Users for Indian BFSI Operations
export const DEMO_USERS = [
  {
    id: 'USER-IN-01',
    name: 'Vikramaditya Verma',
    email: 'vikram.verma@zensar-defense.in',
    role: 'Lead Threat Hunter (BFSI Cyber Defense)',
    badge: 'Senior AML Analyst (L2)',
    department: 'Financial Crime & Threat Intelligence (Zensar BFSI)',
    avatar: 'VV',
    password: 'password123'
  },
  {
    id: 'USER-IN-02',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@zensar-defense.in',
    role: 'Chief Risk & RBI Compliance Officer',
    badge: 'Operations Lead',
    department: 'Regulatory Governance & PMLA Cell',
    avatar: 'AI',
    password: 'password123'
  }
];

// Indian Compliance Audit Trail (RBI, NPCI, PMLA)
export const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUDIT-8901',
    timestamp: '2026-10-31 14:31:00',
    actor: 'Vikramaditya Verma',
    role: 'Lead Threat Hunter (L2)',
    action: 'UPI_VPA_FROZEN',
    targetId: 'UTR-884920112',
    details: 'Frozen mule cluster node mule_node_99@ibl. Reported ₹99,999 structured laundering attempt to Indian Cyber Crime Portal (1930).'
  },
  {
    id: 'AUDIT-8900',
    timestamp: '2026-10-31 14:15:30',
    actor: 'Ananya Iyer',
    role: 'Chief Risk Officer (Admin)',
    action: 'RULE_UPDATED',
    targetId: 'RULE-101',
    details: 'Recalibrated High-Value Outlier threshold to ₹2,00,000 in accordance with updated RBI Master Direction on digital transactions.'
  },
  {
    id: 'AUDIT-8899',
    timestamp: '2026-10-31 13:45:00',
    actor: 'NPCI Threat Sync Engine',
    role: 'Automated Cyber Feed',
    action: 'MULE_RING_DATABASE_SYNC',
    targetId: 'NPCI_REGISTRY',
    details: 'Synced 842 newly blacklisted mule VPAs and compromised IMEI devices across 28 scheduled commercial banks.'
  }
];

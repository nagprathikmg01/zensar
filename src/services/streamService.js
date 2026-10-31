// Real-Time Transaction Stream Service — Indian BFSI / UPI / NPCI Infrastructure
// 25+ distinct scenarios across 4 risk tiers for diverse dashboard experience

const INDIAN_CUSTOMERS = [
  { id: 'CUST-IN-8812', name: 'Neha Roy',       vpa: 'neha.r@oksbi',          accountNumber: '**** **** 5521', bank: 'SBI',                 riskTier: 'LOW',    accountAgeMonths: 48, avgMonthlySpend: 92000 },
  { id: 'CUST-IN-1044', name: 'Priya Sharma',    vpa: 'priya.sharma@okaxis',   accountNumber: '**** **** 4019', bank: 'Axis Bank',           riskTier: 'MEDIUM', accountAgeMonths: 24, avgMonthlySpend: 85000 },
  { id: 'CUST-IN-4091', name: 'Aman Kumar',      vpa: 'aman.kumar@okhdfcbank', accountNumber: '**** **** 8192', bank: 'HDFC Bank',           riskTier: 'HIGH',   accountAgeMonths: 3,  avgMonthlySpend: 45000 },
  { id: 'CUST-IN-5510', name: 'Rohit Mehta',     vpa: 'rohit.m@okicici',       accountNumber: '**** **** 1290', bank: 'ICICI Bank',          riskTier: 'LOW',    accountAgeMonths: 36, avgMonthlySpend: 54000 },
  { id: 'CUST-IN-6119', name: 'Sumit Vashisht',  vpa: 'sumit.v@paytm',         accountNumber: '**** **** 4910', bank: 'Paytm Payments Bank', riskTier: 'HIGH',   accountAgeMonths: 9,  avgMonthlySpend: 62000 },
  { id: 'CUST-IN-2299', name: 'Sneha Kulkarni',  vpa: 'sneha.k@okhdfcbank',    accountNumber: '**** **** 6772', bank: 'HDFC Bank',           riskTier: 'LOW',    accountAgeMonths: 52, avgMonthlySpend: 78000 },
  { id: 'CUST-IN-3310', name: 'Vikram Joshi',    vpa: 'vikram.j@okkotak',      accountNumber: '**** **** 9088', bank: 'Kotak Mahindra',      riskTier: 'MEDIUM', accountAgeMonths: 18, avgMonthlySpend: 41000 },
  { id: 'CUST-IN-7741', name: 'Anjali Deshmukh', vpa: 'anjali.d@okindus',      accountNumber: '**** **** 3342', bank: 'IndusInd Bank',       riskTier: 'LOW',    accountAgeMonths: 30, avgMonthlySpend: 66000 },
  { id: 'CUST-IN-9920', name: 'Rajesh Pillai',   vpa: 'rajesh.p@ybl',          accountNumber: '**** **** 7731', bank: 'YES Bank',            riskTier: 'MEDIUM', accountAgeMonths: 14, avgMonthlySpend: 58000 },
  { id: 'CUST-IN-1182', name: 'Divya Menon',     vpa: 'divya.m@oksbi',         accountNumber: '**** **** 2204', bank: 'SBI',                 riskTier: 'LOW',    accountAgeMonths: 60, avgMonthlySpend: 71000 },
];

const INDIAN_CITIES = [
  { city: 'Mumbai',    country: 'India', ipPrefix: '103.211.54.' },
  { city: 'Bengaluru', country: 'India', ipPrefix: '115.112.8.'  },
  { city: 'Pune',      country: 'India', ipPrefix: '49.206.12.'  },
  { city: 'Delhi NCR', country: 'India', ipPrefix: '73.180.44.'  },
  { city: 'Hyderabad', country: 'India', ipPrefix: '182.72.19.'  },
  { city: 'Chennai',   country: 'India', ipPrefix: '122.164.88.' },
  { city: 'Ahmedabad', country: 'India', ipPrefix: '103.55.70.'  },
  { city: 'Kolkata',   country: 'India', ipPrefix: '117.217.62.' },
  { city: 'Jaipur',    country: 'India', ipPrefix: '180.149.44.' },
];

const HIGH_RISK_GEOS = [
  { city: 'Foreign Proxy (Dubai)',  country: 'UAE',      ipPrefix: '194.230.14.'  },
  { city: 'Bangkok Gateway Proxy',  country: 'Thailand', ipPrefix: '171.96.22.'   },
  { city: 'Lagos Hawala Node',      country: 'Nigeria',  ipPrefix: '102.164.21.'  },
  { city: 'Kyiv DarkNet Relay',     country: 'Ukraine',  ipPrefix: '185.220.101.' },
  { city: 'Limassol Forex Proxy',   country: 'Cyprus',   ipPrefix: '176.9.3.'     },
];

function rnd(arr)       { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.round(Math.random() * (max - min) + min); }
function ip(prefix)     { return prefix + rand(1, 254); }
function txId()         { return 'UTR-' + Math.floor(800000000 + Math.random() * 199999999); }

function daytimeTs() {
  const d = new Date();
  const h = rand(9, 22);
  return d.toISOString().slice(0, 10) + ' ' + String(h).padStart(2, '0') + ':' + String(rand(0, 59)).padStart(2, '0') + ':' + String(rand(0, 59)).padStart(2, '0');
}
function offHoursTs() {
  const d = new Date();
  const h = rand(2, 5);
  return d.toISOString().slice(0, 10) + ' ' + String(h).padStart(2, '0') + ':' + String(rand(0, 59)).padStart(2, '0') + ':' + String(rand(0, 59)).padStart(2, '0');
}

// TIER 1: GOOD (65%)
const GOOD_SCENARIOS = [
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(320,1200),   merchant: 'Swiggy Instamart Delivery',      category: 'FOOD_BEVERAGE', channel: 'UPI Instant',      loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(280,900),    merchant: 'Zomato Food Delivery',           category: 'FOOD_BEVERAGE', channel: 'UPI P2M',          loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(450,3200),   merchant: 'Blinkit Quick Commerce',         category: 'GROCERY',       channel: 'UPI Instant',      loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(180,950),    merchant: 'Uber India Cab Service',         category: 'TRAVEL',        channel: 'UPI Instant',      loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(850,5600),   merchant: 'IRCTC Rail E-Tickets',           category: 'TRAVEL',        channel: 'NetBanking IRCTC', loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(1800,9400),  merchant: 'D-Mart Supermarket',             category: 'GROCERY',       channel: 'Debit Card POS',   loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(350,2600),   merchant: 'Apollo Pharmacy Online',         category: 'RETAIL',        channel: 'UPI Instant',      loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(1499,12000), merchant: 'Amazon India Shopping',          category: 'RETAIL',        channel: 'UPI AutoPay',      loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(250,800),    merchant: 'Rapido Bike Taxi',               category: 'TRAVEL',        channel: 'UPI Instant',      loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(99,799),     merchant: 'Hotstar Premium Renewal',        category: 'RETAIL',        channel: 'UPI AutoPay',      loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(500,4500),   merchant: 'Big Bazaar Hypermarket',         category: 'GROCERY',       channel: 'Debit Card POS',   loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(299,1199),   merchant: 'PharmEasy Medicines',            category: 'RETAIL',        channel: 'UPI Instant',      loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(649,3200),   merchant: 'Flipkart Online Shopping',       category: 'RETAIL',        channel: 'UPI Instant',      loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(80,350),     merchant: 'Chai Point Coffee',              category: 'FOOD_BEVERAGE', channel: 'UPI P2M',          loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(1200,8500),  merchant: 'Ola Electric Booking',           category: 'TRAVEL',        channel: 'Credit Card POS',  loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(200,1200),   merchant: 'Dunzo Hyperlocal Delivery',      category: 'FOOD_BEVERAGE', channel: 'UPI Instant',      loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(3500,18000), merchant: 'Vijay Sales Electronics',        category: 'RETAIL',        channel: 'Credit Card POS',  loc: l }; },
];

// TIER 2: ELEVATED (15%)
const ELEVATED_SCENARIOS = [
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(22000,48000),  merchant: 'MakeMyTrip International Flight', category: 'TRAVEL',   channel: 'Credit Card POS', loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(15000,38000),  merchant: 'Croma Electronics Store',         category: 'RETAIL',   channel: 'Credit Card EMI', loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(8000,24000),   merchant: 'Nykaa Beauty and Wellness',       category: 'RETAIL',   channel: 'UPI Instant',     loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(12000,35000),  merchant: 'Paytm Money Mutual Fund SIP',     category: 'TRANSFER', channel: 'IMPS Fast',       loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(5500,18000),   merchant: 'Decathlon Sports Store',          category: 'RETAIL',   channel: 'Debit Card POS',  loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(25000,55000),  merchant: 'LIC Premium Payment',             category: 'TRANSFER', channel: 'NetBanking NEFT', loc: l }; },
];

// TIER 3: REVIEW (13%)
const REVIEW_SCENARIOS = [
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(120000,240000), merchant: 'Tanishq Jewellery Store',        category: 'LUXURY',   channel: 'Credit Card POS', loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(89000,169000),  merchant: 'Apple Authorized Reseller BKC',  category: 'LUXURY',   channel: 'UPI Instant',     loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(75000,140000),  merchant: 'Reliance Digital MegaStore',     category: 'RETAIL',   channel: 'Credit Card EMI', loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(150000,210000), merchant: 'Real Estate Token Advance',      category: 'TRANSFER', channel: 'IMPS Fast',       loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(65000,130000),  merchant: 'Louis Vuitton Select Citywalk',  category: 'LUXURY',   channel: 'Credit Card POS', loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(90000,180000),  merchant: 'Kalyan Jewellers Gold Purchase', category: 'LUXURY',   channel: 'Debit Card POS',  loc: l }; },
  function() { var l=rnd(INDIAN_CITIES); return { amount: rand(200000,350000), merchant: 'InterContinental Hotel Advance', category: 'TRAVEL',   channel: 'Credit Card POS', loc: l }; },
];

// TIER 4: ATTACK (7%)
const ATTACK_SCENARIOS = [
  function() { var l=HIGH_RISK_GEOS[0]; return { amount: rand(350000,950000), merchant: 'Dubai Crypto Hawala P2P',          category: 'CRYPTO',   channel: 'RTGS / IMPS Fast',  customer: INDIAN_CUSTOMERS[2], loc: l, ts: offHoursTs() }; },
  function() { var l=HIGH_RISK_GEOS[3]; return { amount: rand(250000,680000), merchant: 'Casino Goa Offshore Wallet',       category: 'GAMBLING', channel: 'UPI NetBanking',     customer: INDIAN_CUSTOMERS[4], loc: l, ts: offHoursTs() }; },
  function() { var l=HIGH_RISK_GEOS[1]; return { amount: rand(380000,890000), merchant: 'Telegram Task Scam Syndicate',     category: 'TRANSFER', channel: 'RTGS Fast',          customer: INDIAN_CUSTOMERS[1], loc: l, ts: offHoursTs() }; },
  function() { var l=HIGH_RISK_GEOS[4]; return { amount: rand(420000,780000), merchant: 'Cyprus Unregistered Forex Escrow', category: 'CRYPTO',   channel: 'IMPS Direct',        customer: INDIAN_CUSTOMERS[6], loc: l, ts: offHoursTs() }; },
  function() { var l=HIGH_RISK_GEOS[2]; return { amount: rand(300000,640000), merchant: 'Mule Ring Structuring Node 04',    category: 'TRANSFER', channel: 'NEFT Bulk Transfer', customer: INDIAN_CUSTOMERS[8], loc: l, ts: offHoursTs() }; },
  function() { var l=rnd(INDIAN_CITIES);return { amount: rand(180000,420000), merchant: 'WazirX P2P Crypto OTC Desk',       category: 'CRYPTO',   channel: 'UPI P2P',            customer: INDIAN_CUSTOMERS[2], loc: l, ts: offHoursTs() }; },
];

export function generateLegitimateTransaction() {
  var s = rnd(GOOD_SCENARIOS)();
  return {
    id: txId(), timestamp: daytimeTs(), channel: s.channel,
    customer: rnd(INDIAN_CUSTOMERS), amount: s.amount, currency: 'INR',
    merchant: s.merchant, category: s.category,
    location: { city: s.loc.city, country: s.loc.country, ip: ip(s.loc.ipPrefix) }
  };
}

export function generateStreamedTransaction() {
  var roll = Math.random();

  if (roll < 0.07) {
    var a = rnd(ATTACK_SCENARIOS)();
    return { id: txId(), timestamp: a.ts || offHoursTs(), channel: a.channel, customer: a.customer || rnd(INDIAN_CUSTOMERS), amount: a.amount, currency: 'INR', merchant: a.merchant, category: a.category, location: { city: a.loc.city, country: a.loc.country, ip: ip(a.loc.ipPrefix) } };
  }
  if (roll < 0.20) {
    var r = rnd(REVIEW_SCENARIOS)();
    return { id: txId(), timestamp: daytimeTs(), channel: r.channel, customer: rnd(INDIAN_CUSTOMERS), amount: r.amount, currency: 'INR', merchant: r.merchant, category: r.category, location: { city: r.loc.city, country: r.loc.country, ip: ip(r.loc.ipPrefix) } };
  }
  if (roll < 0.35) {
    var e = rnd(ELEVATED_SCENARIOS)();
    return { id: txId(), timestamp: daytimeTs(), channel: e.channel, customer: rnd(INDIAN_CUSTOMERS), amount: e.amount, currency: 'INR', merchant: e.merchant, category: e.category, location: { city: e.loc.city, country: e.loc.country, ip: ip(e.loc.ipPrefix) } };
  }

  return generateLegitimateTransaction();
}

export function generateExplicitAttackPayload() {
  var a = rnd(ATTACK_SCENARIOS)();
  return {
    id: txId(), timestamp: a.ts || offHoursTs(), channel: a.channel || 'RTGS Fast',
    customer: a.customer || INDIAN_CUSTOMERS[2], amount: a.amount, currency: 'INR',
    merchant: a.merchant, category: a.category,
    location: { city: a.loc.city, country: a.loc.country, ip: ip(a.loc.ipPrefix) }
  };
}

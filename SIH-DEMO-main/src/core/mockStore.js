/**
 * SmartNAWI Metrological Repository & State Store
 * Persistent via LocalStorage with initial rich sample data
 */
import { evaluatePerformanceTest, evaluateRepeatabilityTest, evaluateEccentricityTest, RULE_VERSIONS } from './ruleEngine';
import { calculateSHA256, generateDigitalSignature } from './cryptoUtils';

const STORAGE_KEY = 'SMARTNAWI_STORE_V1';

export const INITIAL_LABS = [
  {
    id: 'LAB-DEL-01',
    name: 'National Metrology Testing Center, New Delhi',
    code: 'NMTC-DOCA-01',
    accreditation: 'NABL ISO/IEC 17025:2017 (Cert # CC-2489)',
    location: 'Krishi Bhawan, New Delhi 110001',
    director: 'Dr. Suresh Chandra (Director Legal Metrology)',
    phone: '+91-11-2338-7621',
    email: 'metrology.delhi@nic.in'
  },
  {
    id: 'LAB-BLR-02',
    name: 'Regional Reference Standard Laboratory (RRSL), Bengaluru',
    code: 'RRSL-BLR-02',
    accreditation: 'NABL ISO/IEC 17025:2017 (Cert # CC-3102)',
    location: 'Peenya Industrial Area, Bengaluru 560058',
    director: 'Dr. Ramesh Babu',
    phone: '+91-80-2839-4412',
    email: 'rrsl.bengaluru@nic.in'
  },
  {
    id: 'LAB-AMD-03',
    name: 'Regional Reference Standard Laboratory (RRSL), Ahmedabad',
    code: 'RRSL-AMD-03',
    accreditation: 'NABL ISO/IEC 17025:2017 (Cert # CC-1988)',
    location: 'Vatva, Ahmedabad, Gujarat 382445',
    director: 'Smt. K. Patel',
    phone: '+91-79-2583-1190',
    email: 'rrsl.ahmedabad@nic.in'
  }
];

export const USERS = [
  {
    id: 'USR-TECH-01',
    name: 'Rajesh Verma',
    role: 'LAB_TECHNICIAN',
    roleLabel: 'Laboratory Metrology Technician',
    email: 'rajesh.verma@lab.gov.in',
    labId: 'LAB-DEL-01',
    avatar: '👨‍🔬',
    badgeColor: 'cyan'
  },
  {
    id: 'USR-REV-02',
    name: 'Ananya Iyer',
    role: 'REVIEWER',
    roleLabel: 'Certifying Officer & Reviewer',
    email: 'ananya.iyer@doca.gov.in',
    labId: 'LAB-DEL-01',
    avatar: '👩‍💼',
    badgeColor: 'purple'
  },
  {
    id: 'USR-ADM-03',
    name: 'Dr. Priya Sharma',
    role: 'ADMIN',
    roleLabel: 'Metrology Administrator & Rule Custodian',
    email: 'priya.sharma@gov.in',
    labId: 'LAB-DEL-01',
    avatar: '🛡️',
    badgeColor: 'amber'
  },
  {
    id: 'USR-PUB-04',
    name: 'Vikram Nair (Auditor)',
    role: 'VERIFIER',
    roleLabel: 'Public / Third-Party Inspector',
    email: 'auditor.nair@trade-inspect.org',
    labId: 'LAB-BLR-02',
    avatar: '🔍',
    badgeColor: 'emerald'
  }
];

export const INITIAL_INSTRUMENTS = [
  {
    id: 'INST-2026-001',
    serialNumber: 'SN-98231-A',
    model: 'PrecisionLab PL-300',
    manufacturer: 'Avery Metrology India Ltd.',
    instrumentClass: 'CLASS_III',
    capacity: 30,
    unit: 'kg',
    scaleInterval: 0.01, // e = 10 g (0.01 kg)
    actualInterval: 0.001, // d = 1 g
    verificationScaleIntervals: 3000, // n = 30 / 0.01 = 3000
    minCapacity: 0.2, // 20 e = 0.2 kg
    tareMax: 10,
    labId: 'LAB-DEL-01',
    deviceType: 'Electronic Bench Scale',
    manufacturingYear: 2025,
    approvedModelNumber: 'IND-DOCA-2025-081',
    status: 'ACTIVE',
    createdAt: '2026-08-15T10:30:00Z'
  },
  {
    id: 'INST-2026-002',
    serialNumber: 'SEC-225-8841',
    model: 'Secura 225D Semi-Micro',
    manufacturer: 'Sartorius Metrology Corp',
    instrumentClass: 'CLASS_I',
    capacity: 0.22, // 220 g in kg
    unit: 'g',
    scaleInterval: 0.001, // e = 1 mg
    actualInterval: 0.0001, // d = 0.1 mg
    verificationScaleIntervals: 220000,
    minCapacity: 0.01,
    tareMax: 0.22,
    labId: 'LAB-DEL-01',
    deviceType: 'Analytical Microbalance',
    manufacturingYear: 2026,
    approvedModelNumber: 'IND-DOCA-2026-014',
    status: 'ACTIVE',
    createdAt: '2026-08-20T11:00:00Z'
  },
  {
    id: 'INST-2026-003',
    serialNumber: 'MT-JE503-492',
    model: 'JewelCheck JE-503',
    manufacturer: 'Mettler Toledo Weighing',
    instrumentClass: 'CLASS_II',
    capacity: 505,
    unit: 'g',
    scaleInterval: 0.01, // e = 10 mg
    actualInterval: 0.001, // d = 1 mg
    verificationScaleIntervals: 50500,
    minCapacity: 0.5,
    tareMax: 505,
    labId: 'LAB-BLR-02',
    deviceType: 'High-Precision Gold & Gem Scale',
    manufacturingYear: 2025,
    approvedModelNumber: 'IND-DOCA-2025-119',
    status: 'ACTIVE',
    createdAt: '2026-08-22T09:15:00Z'
  },
  {
    id: 'INST-2026-004',
    serialNumber: 'ESS-DS215-992',
    model: 'Essae Industrial Platform DS-215',
    manufacturer: 'Essae-Teraoka Ltd.',
    instrumentClass: 'CLASS_III',
    capacity: 150,
    unit: 'kg',
    scaleInterval: 0.05, // e = 50 g
    actualInterval: 0.01, // d = 10 g
    verificationScaleIntervals: 3000,
    minCapacity: 1.0,
    tareMax: 50,
    labId: 'LAB-AMD-03',
    deviceType: 'Heavy Duty Floor Scale',
    manufacturingYear: 2026,
    approvedModelNumber: 'IND-DOCA-2026-092',
    status: 'ACTIVE',
    createdAt: '2026-08-28T14:20:00Z'
  }
];

export const DEMO_TEST_SCENARIOS = {
  PERFECT_PASS: {
    name: 'Scenario A: Standard Precision Scale (PASS)',
    description: 'All test points strictly within OIML R-76 Class III tolerance band (|Error| <= 0.5e, 1.0e, 1.5e).',
    instrumentId: 'INST-2026-001',
    environmental: {
      temperature: 23.4,
      humidity: 52.0,
      pressure: 1013.2,
      weightsSetNo: 'F1-NABL-2025-998'
    },
    observations: [
      { appliedLoad: 0, referenceValue: 0, indicatedValue: 0.000, deltaL: 0, direction: 'INC' },
      { appliedLoad: 0.2, referenceValue: 0.2, indicatedValue: 0.200, deltaL: 0, direction: 'INC' },
      { appliedLoad: 5.0, referenceValue: 5.0, indicatedValue: 5.002, deltaL: 0, direction: 'INC' },
      { appliedLoad: 10.0, referenceValue: 10.0, indicatedValue: 10.003, deltaL: 0, direction: 'INC' },
      { appliedLoad: 20.0, referenceValue: 20.0, indicatedValue: 20.004, deltaL: 0, direction: 'INC' },
      { appliedLoad: 30.0, referenceValue: 30.0, indicatedValue: 30.005, deltaL: 0, direction: 'INC' },
      { appliedLoad: 20.0, referenceValue: 20.0, indicatedValue: 20.004, deltaL: 0, direction: 'DEC' },
      { appliedLoad: 10.0, referenceValue: 10.0, indicatedValue: 10.002, deltaL: 0, direction: 'DEC' },
      { appliedLoad: 0, referenceValue: 0, indicatedValue: 0.000, deltaL: 0, direction: 'DEC' }
    ],
    repeatability: [
      { appliedLoad: 15.0, indicatedValue: 15.002 },
      { appliedLoad: 15.0, indicatedValue: 15.003 },
      { appliedLoad: 15.0, indicatedValue: 15.002 }
    ],
    eccentricity: [
      { positionName: '1 - Center', appliedLoad: 10.0, indicatedValue: 10.001 },
      { positionName: '2 - Front Left', appliedLoad: 10.0, indicatedValue: 10.002 },
      { positionName: '3 - Front Right', appliedLoad: 10.0, indicatedValue: 10.003 },
      { positionName: '4 - Rear Right', appliedLoad: 10.0, indicatedValue: 10.002 },
      { positionName: '5 - Rear Left', appliedLoad: 10.0, indicatedValue: 10.001 }
    ]
  },
  OUT_OF_TOLERANCE_FAIL: {
    name: 'Scenario B: Load Cell Drift at 2000e (FAIL)',
    description: 'Measurement at 20 kg exceeds Class III MPE (Error +0.019 kg > Permissible ±0.015 kg). Non-compliant!',
    instrumentId: 'INST-2026-001',
    environmental: {
      temperature: 24.1,
      humidity: 58.0,
      pressure: 1011.5,
      weightsSetNo: 'F1-NABL-2025-998'
    },
    observations: [
      { appliedLoad: 0, referenceValue: 0, indicatedValue: 0.000, deltaL: 0, direction: 'INC' },
      { appliedLoad: 0.2, referenceValue: 0.2, indicatedValue: 0.201, deltaL: 0, direction: 'INC' },
      { appliedLoad: 5.0, referenceValue: 5.0, indicatedValue: 5.004, deltaL: 0, direction: 'INC' },
      { appliedLoad: 10.0, referenceValue: 10.0, indicatedValue: 10.008, deltaL: 0, direction: 'INC' },
      { appliedLoad: 20.0, referenceValue: 20.0, indicatedValue: 20.019, deltaL: 0, direction: 'INC' }, // Out of tolerance!
      { appliedLoad: 30.0, referenceValue: 30.0, indicatedValue: 30.024, deltaL: 0, direction: 'INC' }, // Out of tolerance!
      { appliedLoad: 20.0, referenceValue: 20.0, indicatedValue: 20.021, deltaL: 0, direction: 'DEC' },
      { appliedLoad: 0, referenceValue: 0, indicatedValue: 0.003, deltaL: 0, direction: 'DEC' }
    ],
    repeatability: [
      { appliedLoad: 15.0, indicatedValue: 15.012 },
      { appliedLoad: 15.0, indicatedValue: 15.025 },
      { appliedLoad: 15.0, indicatedValue: 15.014 }
    ],
    eccentricity: [
      { positionName: '1 - Center', appliedLoad: 10.0, indicatedValue: 10.005 },
      { positionName: '2 - Front Left', appliedLoad: 10.0, indicatedValue: 10.018 },
      { positionName: '3 - Front Right', appliedLoad: 10.0, indicatedValue: 10.006 },
      { positionName: '4 - Rear Right', appliedLoad: 10.0, indicatedValue: 10.008 },
      { positionName: '5 - Rear Left', appliedLoad: 10.0, indicatedValue: 10.004 }
    ]
  },
  MICROBALANCE_PASS: {
    name: 'Scenario C: Semi-Micro Class I Analytical Balance (PASS)',
    description: 'High precision calibration with turning point determination for Class I micro-analytical balances.',
    instrumentId: 'INST-2026-002',
    environmental: {
      temperature: 20.1,
      humidity: 48.5,
      pressure: 1015.0,
      weightsSetNo: 'E2-NABL-2026-001'
    },
    observations: [
      { appliedLoad: 0, referenceValue: 0, indicatedValue: 0.0000, deltaL: 0, direction: 'INC' },
      { appliedLoad: 0.01, referenceValue: 0.01, indicatedValue: 0.0100, deltaL: 0, direction: 'INC' },
      { appliedLoad: 0.05, referenceValue: 0.05, indicatedValue: 0.0501, deltaL: 0, direction: 'INC' },
      { appliedLoad: 0.10, referenceValue: 0.10, indicatedValue: 0.1002, deltaL: 0, direction: 'INC' },
      { appliedLoad: 0.20, referenceValue: 0.20, indicatedValue: 0.2003, deltaL: 0, direction: 'INC' },
      { appliedLoad: 0.22, referenceValue: 0.22, indicatedValue: 0.2203, deltaL: 0, direction: 'INC' },
      { appliedLoad: 0.10, referenceValue: 0.10, indicatedValue: 0.1001, deltaL: 0, direction: 'DEC' },
      { appliedLoad: 0, referenceValue: 0, indicatedValue: 0.0000, deltaL: 0, direction: 'DEC' }
    ],
    repeatability: [
      { appliedLoad: 0.10, indicatedValue: 0.1002 },
      { appliedLoad: 0.10, indicatedValue: 0.1002 },
      { appliedLoad: 0.10, indicatedValue: 0.1001 }
    ],
    eccentricity: [
      { positionName: '1 - Center', appliedLoad: 0.07, indicatedValue: 0.0701 },
      { positionName: '2 - Front Left', appliedLoad: 0.07, indicatedValue: 0.0702 },
      { positionName: '3 - Front Right', appliedLoad: 0.07, indicatedValue: 0.0701 },
      { positionName: '4 - Rear Right', appliedLoad: 0.07, indicatedValue: 0.0702 },
      { positionName: '5 - Rear Left', appliedLoad: 0.07, indicatedValue: 0.0701 }
    ]
  }
};

/**
 * Helper to build initial pre-evaluated sample test & report
 */
export async function createInitialDemoData() {
  const inst1 = INITIAL_INSTRUMENTS[0];
  const perfRes = evaluatePerformanceTest(DEMO_TEST_SCENARIOS.PERFECT_PASS.observations, inst1);
  const repRes = evaluateRepeatabilityTest(DEMO_TEST_SCENARIOS.PERFECT_PASS.repeatability, inst1);
  const eccRes = evaluateEccentricityTest(DEMO_TEST_SCENARIOS.PERFECT_PASS.eccentricity, inst1);

  const testId = 'TEST-2026-1023';
  const reportId = 'RPT-2026-DOCA-1023';
  const timestamp = '2026-09-08T15:30:00Z';

  const testPayload = {
    id: testId,
    reportId,
    instrumentId: inst1.id,
    labId: inst1.labId,
    technicianId: 'USR-TECH-01',
    technicianName: 'Rajesh Verma',
    reviewerId: 'USR-REV-02',
    reviewerName: 'Ananya Iyer',
    ruleVersion: 'OIML-R76-2006',
    testDate: '2026-09-08',
    status: 'APPROVED',
    overallResult: 'PASS',
    environmental: DEMO_TEST_SCENARIOS.PERFECT_PASS.environmental,
    performanceTest: perfRes,
    repeatabilityTest: repRes,
    eccentricityTest: eccRes,
    createdAt: timestamp
  };

  const hash = await calculateSHA256(testPayload);
  const signature = await generateDigitalSignature({
    reportId,
    hash,
    signerName: 'Ananya Iyer',
    signerRole: 'Certifying Officer & Reviewer',
    timestamp
  });

  const report = {
    id: reportId,
    testId,
    instrumentId: inst1.id,
    labId: inst1.labId,
    reportNumber: 'NAWI/DOCA/2026/00123',
    generatedAt: timestamp,
    generatedBy: 'Ananya Iyer',
    status: 'ISSUED',
    result: 'PASS',
    sha256Hash: hash,
    digitalSignature: signature,
    testDataSnapshot: testPayload
  };

  // Test 2: Failing Test
  const failPerf = evaluatePerformanceTest(DEMO_TEST_SCENARIOS.OUT_OF_TOLERANCE_FAIL.observations, inst1);
  const failRep = evaluateRepeatabilityTest(DEMO_TEST_SCENARIOS.OUT_OF_TOLERANCE_FAIL.repeatability, inst1);
  const failEcc = evaluateEccentricityTest(DEMO_TEST_SCENARIOS.OUT_OF_TOLERANCE_FAIL.eccentricity, inst1);

  const failTestId = 'TEST-2026-1024';
  const failReportId = 'RPT-2026-DOCA-1024';
  const failPayload = {
    id: failTestId,
    reportId: failReportId,
    instrumentId: inst1.id,
    labId: inst1.labId,
    technicianId: 'USR-TECH-01',
    technicianName: 'Rajesh Verma',
    reviewerId: 'USR-REV-02',
    reviewerName: 'Ananya Iyer',
    ruleVersion: 'OIML-R76-2006',
    testDate: '2026-09-09',
    status: 'REJECTED',
    overallResult: 'FAIL',
    environmental: DEMO_TEST_SCENARIOS.OUT_OF_TOLERANCE_FAIL.environmental,
    performanceTest: failPerf,
    repeatabilityTest: failRep,
    eccentricityTest: failEcc,
    createdAt: '2026-09-09T09:45:00Z'
  };

  const failHash = await calculateSHA256(failPayload);
  const failReport = {
    id: failReportId,
    testId: failTestId,
    instrumentId: inst1.id,
    labId: inst1.labId,
    reportNumber: 'NAWI/DOCA/2026/00124',
    generatedAt: '2026-09-09T10:00:00Z',
    generatedBy: 'Ananya Iyer',
    status: 'REJECTED_NON_COMPLIANT',
    result: 'FAIL',
    sha256Hash: failHash,
    digitalSignature: null,
    testDataSnapshot: failPayload
  };

  const auditLogs = [
    {
      id: 'AUD-001',
      timestamp: '2026-09-08T14:00:00Z',
      userId: 'USR-TECH-01',
      userName: 'Rajesh Verma',
      action: 'LOGIN',
      category: 'AUTH',
      details: 'User authenticated via Secure JWT Session'
    },
    {
      id: 'AUD-002',
      timestamp: '2026-09-08T14:15:00Z',
      userId: 'USR-TECH-01',
      userName: 'Rajesh Verma',
      action: 'CREATE_TEST',
      category: 'TEST_EXECUTION',
      details: 'Created new OIML R-76 evaluation for instrument SN-98231-A (TEST-2026-1023)'
    },
    {
      id: 'AUD-003',
      timestamp: '2026-09-08T14:35:00Z',
      userId: 'USR-TECH-01',
      userName: 'Rajesh Verma',
      action: 'RULE_ENGINE_EVALUATION',
      category: 'RULE_ENGINE',
      details: 'Executed OIML R-76-1:2006 Rule Engine: All 9 load steps passed MPE evaluation.'
    },
    {
      id: 'AUD-004',
      timestamp: '2026-09-08T15:20:00Z',
      userId: 'USR-REV-02',
      userName: 'Ananya Iyer',
      action: 'APPROVE_REPORT',
      category: 'CERTIFICATION',
      details: 'Reviewed and approved compliance for RPT-2026-DOCA-1023.'
    },
    {
      id: 'AUD-005',
      timestamp: '2026-09-08T15:30:00Z',
      userId: 'USR-REV-02',
      userName: 'Ananya Iyer',
      action: 'DIGITAL_SIGNATURE_APPLIED',
      category: 'SECURITY',
      details: `Generated SHA-256 fingerprint (${hash.substring(0, 16)}...) and signed with PKCS#7 token.`
    },
    {
      id: 'AUD-006',
      timestamp: '2026-09-09T09:47:00Z',
      userId: 'USR-TECH-01',
      userName: 'Rajesh Verma',
      action: 'RULE_ENGINE_EVALUATION',
      category: 'RULE_ENGINE',
      details: 'Executed OIML R-76-1:2006 for TEST-2026-1024: FAIL (Load 20 kg error +0.019 kg > MPE ±0.015 kg)'
    }
  ];

  return {
    labs: INITIAL_LABS,
    users: USERS,
    instruments: INITIAL_INSTRUMENTS,
    tests: [testPayload, failPayload],
    reports: [report, failReport],
    auditLogs,
    ruleVersions: RULE_VERSIONS,
    currentUserId: 'USR-TECH-01'
  };
}

/**
 * Gets the current store or initializes from LocalStorage
 */
export async function getStore() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse local storage, resetting to default store');
    }
  }
  const initial = await createInitialDemoData();
  saveStore(initial);
  return initial;
}

export function saveStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

/**
 * Appends a new audit record to the store
 */
export function logAuditAction(store, { action, category, details, user }) {
  const newLog = {
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    userId: user?.id || 'SYSTEM',
    userName: user?.name || 'System Automated Process',
    action,
    category: category || 'GENERAL',
    details
  };
  store.auditLogs.unshift(newLog);
  saveStore(store);
  return newLog;
}

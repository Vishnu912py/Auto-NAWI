/**
 * OIML R-76-1:2006 Non-Automatic Weighing Instruments (NAWI) Rule Engine
 * Legal Metrology Act, 2009 & Legal Metrology (General) Rules, 2011 (Schedule VII)
 */

export const ACCURACY_CLASSES = {
  CLASS_I: {
    id: 'CLASS_I',
    name: 'Class I (Special)',
    symbol: 'I',
    description: 'Precision balances, microbalances, ultra-high accuracy analytical instruments',
    minE: 0.001, // in g
    minN: 50000,
    maxN: Infinity,
    mpeSteps: [
      { upToE: 50000, mpe: 0.5 },
      { upToE: 200000, mpe: 1.0 },
      { upToE: Infinity, mpe: 1.5 },
    ]
  },
  CLASS_II: {
    id: 'CLASS_II',
    name: 'Class II (High)',
    symbol: 'II',
    description: 'Laboratory scales, precious metals & gemstone weighing scales',
    minE: 0.001,
    minN: 100,
    maxN: 100000,
    mpeSteps: [
      { upToE: 5000, mpe: 0.5 },
      { upToE: 20000, mpe: 1.0 },
      { upToE: 100000, mpe: 1.5 },
    ]
  },
  CLASS_III: {
    id: 'CLASS_III',
    name: 'Class III (Medium)',
    symbol: 'III',
    description: 'Commercial trade scales, industrial platform scales, retail POS scales',
    minE: 0.1,
    minN: 500,
    maxN: 10000,
    mpeSteps: [
      { upToE: 500, mpe: 0.5 },
      { upToE: 2000, mpe: 1.0 },
      { upToE: 10000, mpe: 1.5 },
    ]
  },
  CLASS_IV: {
    id: 'CLASS_IV',
    name: 'Class IV (Ordinary)',
    symbol: 'IIII',
    description: 'Heavy industrial weighbridges, crane scales, bulk hoppers',
    minE: 5.0,
    minN: 100,
    maxN: 1000,
    mpeSteps: [
      { upToE: 50, mpe: 0.5 },
      { upToE: 200, mpe: 1.0 },
      { upToE: 1000, mpe: 1.5 },
    ]
  }
};

export const RULE_VERSIONS = [
  {
    id: 'OIML-R76-2006',
    name: 'OIML R-76-1:2006 (International Standard)',
    standardBody: 'International Organization of Legal Metrology (OIML)',
    effectiveDate: '2006-10-15',
    active: true,
    verificationMultiplier: 1.0, // initial verification
    inServiceMultiplier: 2.0,    // in-service inspection allows 2x mpe
    description: 'Standard international specification for metrological and technical requirements of NAWI.'
  },
  {
    id: 'LM-INDIA-2011',
    name: 'Legal Metrology (General) Rules 2011 (India)',
    standardBody: 'Department of Consumer Affairs (DoCA), Govt. of India',
    effectiveDate: '2011-04-01',
    active: true,
    verificationMultiplier: 1.0,
    inServiceMultiplier: 2.0,
    description: 'Seventh Schedule specifications for Non-Automatic Weighing Instruments.'
  },
  {
    id: 'IS-9281-2019',
    name: 'BIS IS 9281:2019',
    standardBody: 'Bureau of Indian Standards',
    effectiveDate: '2019-08-01',
    active: false,
    verificationMultiplier: 1.0,
    inServiceMultiplier: 2.0,
    description: 'Indian Standard on Commercial Electronic Weighing Instruments.'
  }
];

/**
 * Calculates Maximum Permissible Error (MPE) in units of 'e' or load units.
 * @param {number} loadInE - Applied load expressed in multiples of verification scale interval 'e' (m = L / e)
 * @param {string} instrumentClass - 'CLASS_I' | 'CLASS_II' | 'CLASS_III' | 'CLASS_IV'
 * @param {boolean} isInService - Whether the test is in-service (true) or initial type evaluation (false)
 * @param {number} scaleIntervalE - Value of verification scale interval 'e' (e.g. 0.001 kg, 1 g)
 */
export function getMPE(loadInE, instrumentClass = 'CLASS_III', isInService = false, scaleIntervalE = 1) {
  const cls = ACCURACY_CLASSES[instrumentClass] || ACCURACY_CLASSES.CLASS_III;
  const absLoadInE = Math.abs(loadInE);
  
  let baseMpeE = 0.5;
  for (const step of cls.mpeSteps) {
    if (absLoadInE <= step.upToE) {
      baseMpeE = step.mpe;
      break;
    }
  }

  const multiplier = isInService ? 2.0 : 1.0;
  const mpeInE = baseMpeE * multiplier;
  const mpeInLoadUnits = mpeInE * scaleIntervalE;

  return {
    mpeInE,
    mpeInLoadUnits: Number(mpeInLoadUnits.toFixed(6)),
    stepLimit: baseMpeE,
    multiplier
  };
}

/**
 * Computes observed error, corrected error (using turning point delta L or zero error),
 * compares with MPE, and outputs pass/fail status with margin percentage.
 */
export function evaluateObservation({
  appliedLoad,
  referenceValue,
  indicatedValue,
  deltaL = 0, // small weights added to reach next turning point
  zeroError = 0,
  scaleIntervalE = 1,
  instrumentClass = 'CLASS_III',
  isInService = false
}) {
  const L = Number(appliedLoad) || 0;
  const Ref = Number(referenceValue !== undefined && referenceValue !== '' ? referenceValue : appliedLoad);
  const I = Number(indicatedValue) || 0;
  const e = Number(scaleIntervalE) || 1;

  // Indication calculated using small weights method if deltaL provided: P = I + 0.5*e - deltaL
  const hasDeltaL = deltaL !== 0 && deltaL !== undefined;
  const P = hasDeltaL ? (I + 0.5 * e - Number(deltaL)) : I;

  // Uncorrected error: E = P - L (or I - Ref)
  const rawError = Number((P - Ref).toFixed(6));

  // Corrected error: Ec = E - E0
  const correctedError = Number((rawError - Number(zeroError)).toFixed(6));

  // Load in multiples of 'e'
  const loadInE = e > 0 ? (L / e) : 0;
  const mpeInfo = getMPE(loadInE, instrumentClass, isInService, e);

  const absError = Math.abs(correctedError);
  const mpeLimit = mpeInfo.mpeInLoadUnits;
  const passed = absError <= (mpeLimit + 0.000001);

  // Utilization percentage of tolerance (0% = perfect center, 100% = right at boundary, >100% = fail)
  const marginPercent = mpeLimit > 0 ? Math.min(Math.round((absError / mpeLimit) * 100), 200) : 0;

  return {
    appliedLoad: L,
    referenceValue: Ref,
    indicatedValue: I,
    calculatedP: Number(P.toFixed(6)),
    rawError,
    correctedError,
    loadInE: Math.round(loadInE),
    mpeInE: mpeInfo.mpeInE,
    mpeLimit,
    absError,
    passed,
    marginPercent,
    ruleSummary: `OIML R-76 ${instrumentClass} (|Error|: ${absError.toFixed(4)} <= MPE: ±${mpeLimit.toFixed(4)})`
  };
}

/**
 * Validates complete Weighing Performance Test dataset
 */
export function evaluatePerformanceTest(observations, instrument, ruleConfig = {}) {
  const e = Number(instrument.scaleInterval) || 1;
  const instrumentClass = instrument.instrumentClass || 'CLASS_III';
  const isInService = Boolean(ruleConfig.isInService);

  // Find zero load point for zero error E0
  const zeroObs = observations.find(o => Number(o.appliedLoad) === 0);
  let zeroError = 0;
  if (zeroObs) {
    const rawZero = Number(zeroObs.indicatedValue) - Number(zeroObs.appliedLoad);
    zeroError = isNaN(rawZero) ? 0 : rawZero;
  }

  let allPassed = true;
  const evaluatedPoints = observations.map((obs, index) => {
    const res = evaluateObservation({
      appliedLoad: obs.appliedLoad,
      referenceValue: obs.referenceValue,
      indicatedValue: obs.indicatedValue,
      deltaL: obs.deltaL,
      zeroError,
      scaleIntervalE: e,
      instrumentClass,
      isInService
    });

    if (!res.passed) {
      allPassed = false;
    }

    return {
      id: obs.id || `pt-${index + 1}`,
      stepName: obs.stepName || `Load ${obs.appliedLoad} ${instrument.unit || 'kg'}`,
      direction: obs.direction || 'INC', // 'INC' | 'DEC'
      ...res
    };
  });

  // Calculate Max Deviation
  const maxErrorPoint = evaluatedPoints.reduce((max, curr) => curr.absError > (max?.absError || 0) ? curr : max, null);

  return {
    testType: 'WEIGHING_PERFORMANCE',
    name: 'Weighing Performance Test (Increasing & Decreasing Load)',
    passed: allPassed && evaluatedPoints.length > 0,
    totalPoints: evaluatedPoints.length,
    passedPoints: evaluatedPoints.filter(p => p.passed).length,
    failedPoints: evaluatedPoints.filter(p => !p.passed).length,
    zeroError,
    maxErrorPoint,
    evaluatedPoints
  };
}

/**
 * Validates Repeatability Test (OIML R-76 Clause 3.6.1)
 * Difference between maximum and minimum indication for identical loads cannot exceed |mpe| at that load.
 */
export function evaluateRepeatabilityTest(runs, instrument, ruleConfig = {}) {
  const e = Number(instrument.scaleInterval) || 1;
  const instrumentClass = instrument.instrumentClass || 'CLASS_III';
  const isInService = Boolean(ruleConfig.isInService);

  if (!runs || runs.length < 3) {
    return {
      testType: 'REPEATABILITY',
      name: 'Repeatability Test (Clause 3.6.1)',
      passed: false,
      error: 'Minimum 3 test repetitions required by OIML R-76',
      runs: []
    };
  }

  const load = Number(runs[0].appliedLoad) || 0;
  const loadInE = e > 0 ? (load / e) : 0;
  const mpeInfo = getMPE(loadInE, instrumentClass, isInService, e);

  const indications = runs.map(r => Number(r.indicatedValue) || 0);
  const minInd = Math.min(...indications);
  const maxInd = Math.max(...indications);
  const deltaE = Number((maxInd - minInd).toFixed(6));
  const mpeLimit = mpeInfo.mpeInLoadUnits;

  const passed = deltaE <= (mpeLimit + 0.000001);

  return {
    testType: 'REPEATABILITY',
    name: 'Repeatability Test (Clause 3.6.1)',
    load,
    runsCount: runs.length,
    minIndication: minInd,
    maxIndication: maxInd,
    deltaE,
    mpeLimit,
    passed,
    runs: runs.map((r, i) => ({
      runNumber: i + 1,
      appliedLoad: r.appliedLoad,
      indicatedValue: r.indicatedValue,
      error: Number((Number(r.indicatedValue) - Number(r.appliedLoad)).toFixed(6))
    }))
  };
}

/**
 * Validates Eccentricity Test (OIML R-76 Clause 3.6.2)
 * Eccentric (off-center / corner) loading on platter (e.g. 1/3 Max).
 */
export function evaluateEccentricityTest(positions, instrument, ruleConfig = {}) {
  const e = Number(instrument.scaleInterval) || 1;
  const instrumentClass = instrument.instrumentClass || 'CLASS_III';
  const isInService = Boolean(ruleConfig.isInService);

  if (!positions || positions.length === 0) {
    return {
      testType: 'ECCENTRICITY',
      name: 'Eccentricity (Off-Center Loading) Test (Clause 3.6.2)',
      passed: false,
      positions: []
    };
  }

  let allPassed = true;
  const evaluatedPositions = positions.map(pos => {
    const L = Number(pos.appliedLoad) || 0;
    const I = Number(pos.indicatedValue) || 0;
    const rawError = Number((I - L).toFixed(6));
    const loadInE = e > 0 ? (L / e) : 0;
    const mpeInfo = getMPE(loadInE, instrumentClass, isInService, e);
    const passed = Math.abs(rawError) <= (mpeInfo.mpeInLoadUnits + 0.000001);

    if (!passed) allPassed = false;

    return {
      positionName: pos.positionName || 'Center',
      appliedLoad: L,
      indicatedValue: I,
      error: rawError,
      mpeLimit: mpeInfo.mpeInLoadUnits,
      passed
    };
  });

  return {
    testType: 'ECCENTRICITY',
    name: 'Eccentricity Test (Clause 3.6.2)',
    passed: allPassed,
    totalPositions: evaluatedPositions.length,
    evaluatedPositions
  };
}

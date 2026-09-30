/**
 * Cryptographic & Tamper-Evident Utility Functions
 * Uses browser Web Crypto API (SubtleCrypto) for true cryptographic SHA-256 hashing.
 */
import QRCode from 'qrcode';

/**
 * Calculates deterministic SHA-256 hash of any JavaScript object or string.
 */
export async function calculateSHA256(data) {
  const jsonStr = typeof data === 'string' ? data : JSON.stringify(data, Object.keys(data).sort());
  const msgBuffer = new TextEncoder().encode(jsonStr);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Generates a QR Code as Data URL for embedding into reports or verification cards.
 */
export async function generateQRCodeDataUrl(text) {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 180,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('QR code generation error:', err);
    return '';
  }
}

/**
 * Simulates a cryptographic digital signature generation using an asymmetric keypair mock.
 */
export async function generateDigitalSignature({ reportId, hash, signerName, signerRole, timestamp }) {
  const payload = `${reportId}|${hash}|${signerName}|${signerRole}|${timestamp}`;
  const sigHash = await calculateSHA256(payload);
  
  // Format as a realistic X.509 / PKCS#7-like digital signature token
  return {
    signatureToken: `SIG-NAWI-${sigHash.substring(0, 16).toUpperCase()}-${sigHash.substring(16, 32).toUpperCase()}`,
    signerName,
    signerRole,
    algorithm: 'SHA256withRSA-4096 (DoCA Metrology PKI)',
    certificateSerial: `IN-DOCA-${Math.floor(10000000 + Math.random() * 90000000)}`,
    signedAt: timestamp || new Date().toISOString(),
    publicKeyThumbprint: `F8:3D:${sigHash.substring(32, 44).toUpperCase()}`
  };
}

/**
 * Verifies a report record against its stored cryptographic hash.
 */
export async function verifyReportIntegrity(reportData, storedHash) {
  const currentHash = await calculateSHA256(reportData);
  const isValid = currentHash.toLowerCase() === (storedHash || '').toLowerCase();
  
  return {
    isValid,
    currentHash,
    storedHash,
    status: isValid ? 'GENUINE_UNMODIFIED' : 'TAMPER_DETECTED'
  };
}

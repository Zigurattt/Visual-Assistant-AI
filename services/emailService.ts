
export type VerificationErrorCode = 'invalid_format' | 'undeliverable' | 'connection_error' | 'request_failed' | 'unknown';

export interface VerificationResult {
    success: boolean;
    errorCode?: VerificationErrorCode;
}

/**
 * Simulates an email verification process.
 * This function mimics a real API call with a delay.
 * @param email The email address to verify.
 * @returns A promise that resolves to a VerificationResult.
 */
export const verifyEmailAddress = async (email: string): Promise<VerificationResult> => {
  return new Promise((resolve) => {
    // Simulate network latency
    setTimeout(() => {
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        resolve({ success: false, errorCode: 'invalid_format' });
        return;
      }
      
      // Simulate a specific email that is known to be undeliverable for testing purposes
      if (email.toLowerCase().includes('fail')) {
        resolve({ success: false, errorCode: 'undeliverable' });
        return;
      }

      // All other emails are considered valid for this simulation
      resolve({ success: true });
    }, 1500); // 1.5 second delay
  });
};

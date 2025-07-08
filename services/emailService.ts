const DISIFY_API_URL = 'https://www.disify.com/api/email/';

export type VerificationErrorCode = 'invalid_format' | 'undeliverable' | 'connection_error' | 'request_failed' | 'unknown';

export interface VerificationResult {
    success: boolean;
    errorCode?: VerificationErrorCode;
}

interface DisifyResponse {
    format?: boolean;
    domain?: string;
    disposable?: boolean;
    dns?: boolean;
    error?: string; // Disify can return an error field
}


export const verifyEmailAddress = async (email: string): Promise<VerificationResult> => {
  try {
    // Disify is a free API, no key needed.
    const response = await fetch(`${DISIFY_API_URL}${encodeURIComponent(email)}`);

    if (!response.ok) {
      console.error('Disify API error:', await response.text());
      return { success: false, errorCode: 'request_failed' };
    }

    const data: DisifyResponse = await response.json();

    // Check for explicit error from Disify
    if (data.error) {
        console.error('Disify returned an error:', data.error);
        return { success: false, errorCode: 'unknown' };
    }

    // --- New, more robust verification logic ---

    // 1. Check for invalid format. This is the most critical failure.
    if (data.format === false) {
      return { success: false, errorCode: 'invalid_format' };
    }

    // 2. Check for deliverability issues (bad DNS or disposable email provider).
    if (data.dns === false || data.disposable === true) {
      return { success: false, errorCode: 'undeliverable' };
    }

    // 3. If no failure conditions were met, we consider it a success.
    // This is more forgiving if the API omits a field like `dns: true` in its response.
    return { success: true };
    
  } catch (error) {
    console.error("Network or other error during email verification:", error);
    return { success: false, errorCode: 'connection_error' };
  }
};

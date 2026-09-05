import { OnboardingData } from '@/app/onboarding/context';

/**
 * Sends the full onboarding data to the backend registration endpoint.
 * The backend expects application/json matching the RegisterRequest DTO
 * We map the frontend context fields to the exact backend fields here.
 */
export async function registerOwner(data: OnboardingData): Promise<void> {
  const form = new FormData();
  // Basic fields mapped to backend RegisterRequest
  form.append('fullName', data.name ?? '');
  form.append('email', data.email ?? '');
  form.append('password', data.password ?? '');
  form.append('mobile', data.phone ?? '0000000000');
  
  // Business info
  form.append('businessName', data.bakeryName ?? '');
  form.append('businessType', data.bakeryType ?? '');
  if (data.description) form.append('businessDescription', data.description);
  if (data.phone) form.append('businessPhone', data.phone);
  
  // Location
  form.append('addressLine1', data.addressLine1 ?? '');
  if (data.addressLine2) form.append('addressLine2', data.addressLine2);
  form.append('city', data.city ?? '');
  form.append('state', data.state ?? '');
  form.append('pincode', data.pincode ?? '');
  
  // Verification file
  if (data.verificationFile) {
    form.append('verificationFile', data.verificationFile as any);
  }

  const response = await fetch('/api/auth/register', {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    let errorMessage = `Registration failed (${response.status})`;
    try {
      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('application/json')) {
        const json = await response.json();
        
        // Handle Spring Boot validation errors (usually in 'errors' array or map)
        if (json.errors && Array.isArray(json.errors)) {
          errorMessage = json.errors.map((e: any) => e.defaultMessage || e.message).join(', ');
        } else if (json.errors && typeof json.errors === 'object') {
           errorMessage = Object.values(json.errors).join(', ');
        } else if (json.message) {
          errorMessage = json.message;
        } else if (json.error) {
          errorMessage = json.error;
        }
      } else {
        errorMessage = response.status === 400 
          ? 'Validation Error (400) - Please check all required fields (e.g. password must be 8+ chars).'
          : `Registration failed (HTTP ${response.status}).`;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }
}

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VerificationStep from '@/app/onboarding/step-4/page';
import * as OnboardingContext from '../app/onboarding/context';
import * as ApiLib from '../lib/api';

// Mock window.location.assign
const assignMock = jest.fn();
beforeAll(() => {
  // @ts-ignore
  delete global.window.location;
  global.window.location = { assign: assignMock, href: 'http://localhost/' } as any;
});

jest.mock('../app/onboarding/context', () => ({
  useOnboarding: jest.fn(),
}));

jest.mock('../lib/api', () => ({
  registerOwner: jest.fn(),
}));

// Mock SuccessModal to prevent Next Router issues in tests
jest.mock('../components/onboarding/SuccessModal', () => () => <div data-testid="success-modal">Success!</div>);

describe('VerificationStep', () => {
  let mockUpdateField: jest.Mock;
  let mockReset: jest.Mock;

  beforeEach(() => {
    mockUpdateField = jest.fn();
    mockReset = jest.fn();
    (OnboardingLayout.useOnboarding as jest.Mock).mockReturnValue({
      data: {
        verificationFile: undefined,
      },
      updateField: mockUpdateField,
      reset: mockReset,
    });
    (ApiLib.registerOwner as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the file input', () => {
    render(<VerificationStep />);
    
    expect(screen.getByText(/Verification Document/i)).toBeInTheDocument();
  });

  it('shows error if no file is selected on submit', async () => {
    render(<VerificationStep />);
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Please upload a verification document.')).toBeInTheDocument();
    });
  });

  it('calls API and shows success modal on valid submission', async () => {
    // Provide a mock file in context
    (OnboardingLayout.useOnboarding as jest.Mock).mockReturnValue({
      data: {
        verificationFile: new File([''], 'test.pdf', { type: 'application/pdf' }),
      },
      updateField: mockUpdateField,
      reset: mockReset,
    });

    (ApiLib.registerOwner as jest.Mock).mockResolvedValueOnce(undefined);

    render(<VerificationStep />);
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    expect(screen.getByText('Submitting...')).toBeInTheDocument();

    await waitFor(() => {
      expect(ApiLib.registerOwner).toHaveBeenCalled();
      expect(screen.getByTestId('success-modal')).toBeInTheDocument();
      expect(mockReset).toHaveBeenCalled();
    });
  });
});

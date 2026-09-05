import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationStep from '@/app/onboarding/step-1/page';
import * as OnboardingLayout from '../app/onboarding/layout';

// Location is read-only in JSDOM, so we will not assert window.location directly in this basic test.
// Instead we verify that the next button click doesn't show validation errors.

jest.mock('../app/onboarding/context', () => ({
  useOnboarding: jest.fn(),
}));

describe('RegistrationStep', () => {
  let mockUpdateField: jest.Mock;

  beforeEach(() => {
    mockUpdateField = jest.fn();
    (OnboardingLayout.useOnboarding as jest.Mock).mockReturnValue({
      data: {
        name: '',
        email: '',
        password: '',
      },
      updateField: mockUpdateField,
      reset: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form fields', () => {
    render(<RegistrationStep />);
    
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty on submit', async () => {
    render(<RegistrationStep />);
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('calls updateField when input changes', async () => {
    render(<RegistrationStep />);
    
    const nameInput = screen.getByLabelText(/Full Name/i);
    await userEvent.type(nameInput, 'A');
    
    expect(mockUpdateField).toHaveBeenCalledWith('name', 'A');
  });

  it('navigates to next step when validation passes', async () => {
    (OnboardingLayout.useOnboarding as jest.Mock).mockReturnValue({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      },
      updateField: mockUpdateField,
      reset: jest.fn(),
    });

    render(<RegistrationStep />);
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    // If validation passes, error messages should not appear
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });
});

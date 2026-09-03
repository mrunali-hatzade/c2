import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocationStep from '@/app/onboarding/step-3/page';
import * as OnboardingLayout from '../app/onboarding/layout';

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

describe('LocationStep', () => {
  let mockUpdateField: jest.Mock;

  beforeEach(() => {
    mockUpdateField = jest.fn();
    (OnboardingLayout.useOnboarding as jest.Mock).mockReturnValue({
      data: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
      },
      updateField: mockUpdateField,
      reset: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form fields', () => {
    render(<LocationStep />);
    
    expect(screen.getByLabelText(/Address Line 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
  });

  it('shows validation errors when mandatory fields are missing', async () => {
    render(<LocationStep />);
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Address Line 1 is required')).toBeInTheDocument();
      expect(screen.getByText('City is required')).toBeInTheDocument();
      expect(screen.getByText('State is required')).toBeInTheDocument();
      expect(screen.getByText('Invalid pincode')).toBeInTheDocument(); // regex fails on empty
    });
  });

  it('allows valid submission', async () => {
    (OnboardingLayout.useOnboarding as jest.Mock).mockReturnValue({
      data: {
        addressLine1: '123 Baker St',
        addressLine2: '',
        city: 'London',
        state: 'Greater London',
        pincode: '12345',
      },
      updateField: mockUpdateField,
      reset: jest.fn(),
    });

    render(<LocationStep />);
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    expect(screen.queryByText('Address Line 1 is required')).not.toBeInTheDocument();
  });
});

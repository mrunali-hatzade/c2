import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BusinessInfoStep from '@/app/onboarding/step-2/page';
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

describe('BusinessInfoStep', () => {
  let mockUpdateField: jest.Mock;

  beforeEach(() => {
    mockUpdateField = jest.fn();
    (OnboardingLayout.useOnboarding as jest.Mock).mockReturnValue({
      data: {
        bakeryName: '',
        bakeryType: '',
        description: '',
        phone: '',
      },
      updateField: mockUpdateField,
      reset: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form fields', () => {
    render(<BusinessInfoStep />);
    
    expect(screen.getByLabelText(/Bakery Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bakery Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
  });

  it('shows validation errors when mandatory fields are missing', async () => {
    render(<BusinessInfoStep />);
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Bakery name is required')).toBeInTheDocument();
      expect(screen.getByText('Bakery type is required')).toBeInTheDocument();
    });
  });

  it('allows valid submission', async () => {
    (OnboardingLayout.useOnboarding as jest.Mock).mockReturnValue({
      data: {
        bakeryName: 'Sweet Treats',
        bakeryType: 'Pastry',
        description: 'A lovely pastry shop',
        phone: '+1234567890',
      },
      updateField: mockUpdateField,
      reset: jest.fn(),
    });

    render(<BusinessInfoStep />);
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    expect(screen.queryByText('Bakery name is required')).not.toBeInTheDocument();
  });
});

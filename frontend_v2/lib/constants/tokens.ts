/**
 * CakeStore Design Tokens Source of Truth
 * Frozen Baseline from docs/CAKESTORE_DESIGN_SYSTEM.md
 */

export const DESIGN_TOKENS = {
  colors: {
    // Customer / Marketplace / Storefront
    brand: {
      plum: '#C56E56',
      plumHover: '#B05B44',
      crimson: '#A8383B',
      creamLight: '#FCFAF7',
      cream: '#F7F2EC',
      blush: '#FDF2EF',
      espresso: '#2B1822',
      muted: '#7A6B74',
      border: '#EFE8EB',
      surface: '#FFFFFF',
    },
    // Bakery Owner Dashboard
    owner: {
      sidebar: '#3D101E',
      sidebarActive: '#5B1C2E',
      sidebarText: '#E5D0D6',
      canvas: '#F8F9FA',
      card: '#FFFFFF',
      border: '#E9ECEF',
      heading: '#1E293B',
      muted: '#64748B',
      trendPositive: '#10B981',
    },
    // Platform Admin Dashboard
    admin: {
      sidebar: '#162232',
      sidebarActive: '#21354D',
      sidebarText: '#A0AEC0',
      canvas: '#F4F6F9',
      card: '#FFFFFF',
      border: '#E2E8F0',
      accent: '#3182CE',
    },
    // Status indicators
    status: {
      success: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
      warning: { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
      error: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
      info: { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
      pending: { bg: '#FFF7ED', text: '#C2410C', border: '#FFEDD5' },
    },
  },
  typography: {
    fontFamilies: {
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  },
  borderRadius: {
    pill: '9999px',
    container: '24px',
    card: '16px',
    input: '12px',
    badge: '8px',
  },
  shadows: {
    soft: '0 4px 20px -2px rgba(91, 35, 51, 0.05)',
    elevated: '0 10px 25px -3px rgba(43, 24, 16, 0.08)',
    subtle: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;

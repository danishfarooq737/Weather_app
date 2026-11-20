import { describe, it, expect } from 'vitest';
import { themeFor, iconFor, isNight, formatTime } from './weatherTheme';

describe('weatherTheme', () => {
  it('returns a sunny gradient for clear weather during the day', () => {
    const theme = themeFor('Clear', '01d', 0, 0, 0);
    expect(theme.label).toBe('Sunny');
    expect(theme.gradient).toContain('linear-gradient');
  });

  it('returns a rainy gradient for rain', () => {
    const theme = themeFor('Rain', '10d', 0, 0, 0);
    expect(theme.label).toBe('Rainy');
  });

  it('returns a night gradient when the icon ends with n', () => {
    const theme = themeFor('Clear', '01n', 0, 0, 0);
    expect(theme.label).toBe('Night');
  });

  it('returns a cloudy gradient for clouds', () => {
    const theme = themeFor('Clouds', '04d', 0, 0, 0);
    expect(theme.label).toBe('Cloudy');
  });

  it('detects night from sunrise/sunset when the icon has no suffix', () => {
    expect(isNight('01', 1000, 2000, 500)).toBe(true);
    expect(isNight('01', 1000, 2000, 1500)).toBe(false);
  });

  it('picks a rain icon for rainy conditions', () => {
    const Icon = iconFor('Rain', '10d');
    // lucide icons are forwardRef components (typeof 'object')
    expect(Icon).toBeTruthy();
    expect(['function', 'object']).toContain(typeof Icon);
  });

  it('formats unix timestamps as HH:MM', () => {
    expect(formatTime(0)).toBe('—');
    expect(formatTime(1763620800)).toMatch(/^\d{2}:\d{2}$/);
  });
});

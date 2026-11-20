import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ForecastList from './ForecastList';

const forecast = [
  { date: '2026-11-20', day: 'Fri', temp_min: 9, temp_max: 15, condition: 'Rain', description: 'light rain', icon: '10d', humidity: 81, wind_speed: 5.2 },
  { date: '2026-11-21', day: 'Sat', temp_min: 8, temp_max: 13, condition: 'Clouds', description: 'broken clouds', icon: '04d', humidity: 76, wind_speed: 4.1 },
  { date: '2026-11-22', day: 'Sun', temp_min: 7, temp_max: 12, condition: 'Clear', description: 'clear sky', icon: '01d', humidity: 64, wind_speed: 3.4 },
  { date: '2026-11-23', day: 'Mon', temp_min: 6, temp_max: 11, condition: 'Rain', description: 'moderate rain', icon: '10d', humidity: 84, wind_speed: 6.0 },
  { date: '2026-11-24', day: 'Tue', temp_min: 8, temp_max: 14, condition: 'Clouds', description: 'scattered clouds', icon: '03d', humidity: 70, wind_speed: 4.4 },
];

describe('ForecastList', () => {
  it('renders one card per forecast day (Array.map)', () => {
    render(<ForecastList forecast={forecast} />);
    expect(screen.getByText('5-day forecast')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    // All five days are present.
    for (const day of forecast) {
      expect(screen.getByText(day.day)).toBeInTheDocument();
    }
  });

  it('renders nothing for an empty forecast', () => {
    const { container } = render(<ForecastList forecast={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders the input and search button', () => {
    render(<SearchBar onSearch={vi.fn()} loading={false} />);
    expect(screen.getByLabelText(/search for a city/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onSearch with the typed city on submit', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} loading={false} />);
    fireEvent.change(screen.getByLabelText(/search for a city/i), {
      target: { value: 'London' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).toHaveBeenCalledWith('London');
  });

  it('disables the button while loading (no double-submit)', () => {
    render(<SearchBar onSearch={vi.fn()} loading />);
    expect(screen.getByRole('button', { name: /searching/i })).toBeDisabled();
  });

  it('does not submit an empty query', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} loading={false} />);
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).not.toHaveBeenCalled();
  });
});

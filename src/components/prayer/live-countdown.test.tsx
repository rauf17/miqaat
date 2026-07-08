import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LiveCountdown } from './live-countdown';

// P-H-026: component tests for LiveCountdown. Covers the rendering,
// the formatTimeLeft logic (via output), the interval cleanup, and
// the zero-countdown edge case.

describe('LiveCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the time remaining for a future target', () => {
    const now = new Date('2026-01-01T12:00:00Z');
    vi.setSystemTime(now);
    const target = new Date('2026-01-01T12:01:30Z'); // 1m 30s ahead
    render(<LiveCountdown targetTime={target} />);
    expect(screen.getByText(/00:01:30 remaining/)).toBeInTheDocument();
  });

  it('renders 00:00:00 when the target is in the past', () => {
    const now = new Date('2026-01-01T12:00:00Z');
    vi.setSystemTime(now);
    const target = new Date('2026-01-01T11:59:00Z'); // 1m ago
    render(<LiveCountdown targetTime={target} />);
    expect(screen.getByText(/00:00:00 remaining/)).toBeInTheDocument();
  });

  it('updates every second', () => {
    const now = new Date('2026-01-01T12:00:00Z');
    vi.setSystemTime(now);
    const target = new Date('2026-01-01T12:00:10Z'); // 10s ahead
    render(<LiveCountdown targetTime={target} />);
    expect(screen.getByText(/00:00:10 remaining/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000); // 3 seconds
    });
    expect(screen.getByText(/00:00:07 remaining/)).toBeInTheDocument();
  });

  it('clamps to zero when the target passes during the interval', () => {
    const now = new Date('2026-01-01T12:00:00Z');
    vi.setSystemTime(now);
    const target = new Date('2026-01-01T12:00:05Z'); // 5s ahead
    render(<LiveCountdown targetTime={target} />);
    expect(screen.getByText(/00:00:05 remaining/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(10000); // 10 seconds — past the target
    });
    expect(screen.getByText(/00:00:00 remaining/)).toBeInTheDocument();
  });

  it('clears the interval on unmount', () => {
    const now = new Date('2026-01-01T12:00:00Z');
    vi.setSystemTime(now);
    const target = new Date('2026-01-01T12:00:10Z');
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const { unmount } = render(<LiveCountdown targetTime={target} />);
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});

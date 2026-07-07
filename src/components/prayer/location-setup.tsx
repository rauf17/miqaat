'use client';

import * as React from 'react';
import { useLocationStore } from '@/lib/store/locationStore';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { MapPin, Search, Loader2 } from 'lucide-react';

export function LocationSetup() {
  const { setLocation } = useLocationStore();
  const { setManualLocationOverride } = useSettingsStore();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Manual search state
  const [searchQuery, setSearchQuery] = React.useState('');

  const requestLocation = () => {
    setLoading(true);
    setError(null);
    setManualLocationOverride(false);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(`/api/geocode?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
          if (!res.ok) throw new Error('Failed to fetch location data');
          const data = await res.json();
          
          setLocation(
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              city: data.city,
              country: data.country,
            },
            'auto'
          );
        } catch {
          // If reverse geocoding fails, fallback to coordinates with generic name
          // so the user isn't stuck on the setup screen.
          setLocation(
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              city: 'Unknown',
              country: 'Location',
            },
            'auto'
          );
          setError('Failed to fetch city name, but coordinates were saved successfully.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location access denied or timed out. Please enter manually.');
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setManualLocationOverride(false); // Reset while loading

    try {
      const res = await fetch(`/api/geocode?city=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('City not found');
      
      const data = await res.json();
      
      setLocation(
        {
          lat: data.lat,
          lng: data.lng,
          city: data.city,
          country: data.country,
        },
        'manual'
      );
      setManualLocationOverride(true);
      setSearchQuery('');
    } catch {
      setError('Could not find that city. Please try another name.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl bg-card border border-border shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary mb-4">
          <MapPin size={24} />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-card-foreground">Set Location</h2>
        <p className="text-sm text-muted-foreground font-sans">
          We need your location to calculate accurate prayer times.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={requestLocation}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-4 rounded-xl font-medium transition-colors hover:opacity-90 disabled:opacity-50"
        >
          {loading && !searchQuery ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
          {loading && !searchQuery ? 'Locating...' : 'Use Current Location'}
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase font-medium tracking-wider">
            or
          </span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <form onSubmit={handleManualSearch} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city manually..."
              aria-label="Search city manually"
              disabled={loading}
              className="w-full bg-input/50 border border-border rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={!searchQuery.trim() || loading}
            className="w-full py-3 px-4 rounded-xl bg-secondary text-secondary-foreground font-medium transition-colors hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && searchQuery ? <Loader2 className="animate-spin" size={18} /> : null}
            {loading && searchQuery ? 'Searching...' : 'Search Manually'}
          </button>
        </form>

        {error && (
          <div className="p-3 mt-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-start gap-2">
            <span className="shrink-0">⚠️</span>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

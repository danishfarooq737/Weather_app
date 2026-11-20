// Maps an OpenWeatherMap condition + icon to the visual theme:
// dynamic background gradient, accent colour and a lucide icon name.
// Day/night is derived from the icon suffix (d = day, n = night) with a
// sunrise/sunset fallback, so the gradient is right even for cached data.
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
} from 'lucide-react';

export function isNight(icon, sunrise, sunset, dt) {
  if (typeof icon === 'string' && icon.endsWith('n')) return true;
  if (typeof icon === 'string' && icon.endsWith('d')) return false;
  if (sunrise && sunset && dt) return dt < sunrise || dt > sunset;
  return false;
}

/**
 * Returns { gradient, accent, glow, label } for a condition.
 * Gradients are deep, premium multi-stop blends — never flat colours.
 */
export function themeFor(condition, icon, sunrise, sunset, dt) {
  const night = isNight(icon, sunrise, sunset, dt);
  const key = (condition || '').toLowerCase();

  if (night) {
    return {
      gradient:
        'linear-gradient(160deg, #0b1026 0%, #1e1b4b 45%, #312e81 75%, #0f172a 100%)',
      accent: '#a5b4fc',
      glow: 'rgba(165, 180, 252, 0.35)',
      label: 'Night',
    };
  }
  if (key.includes('rain') || key.includes('drizzle') || key.includes('thunder')) {
    return {
      gradient:
        'linear-gradient(160deg, #0f2027 0%, #203a43 45%, #2c5364 80%, #1e3a5f 100%)',
      accent: '#7dd3fc',
      glow: 'rgba(125, 211, 252, 0.35)',
      label: 'Rainy',
    };
  }
  if (key.includes('snow')) {
    return {
      gradient:
        'linear-gradient(160deg, #1e3a5f 0%, #3b6ea5 50%, #7fb3d5 85%, #aed6f1 100%)',
      accent: '#e0f2fe',
      glow: 'rgba(224, 242, 254, 0.4)',
      label: 'Snowy',
    };
  }
  if (key.includes('cloud')) {
    return {
      gradient:
        'linear-gradient(160deg, #2c3e50 0%, #4a6572 45%, #6b8cae 80%, #3d5a73 100%)',
      accent: '#cbd5e1',
      glow: 'rgba(203, 213, 225, 0.35)',
      label: 'Cloudy',
    };
  }
  if (key.includes('mist') || key.includes('fog') || key.includes('haze')) {
    return {
      gradient:
        'linear-gradient(160deg, #3e4c5e 0%, #5c6b7a 50%, #7d8b9b 85%, #4b5a6a 100%)',
      accent: '#d6dee7',
      glow: 'rgba(214, 222, 231, 0.3)',
      label: 'Hazy',
    };
  }
  // Clear / sunny (default).
  return {
    gradient:
      'linear-gradient(160deg, #0ea5e9 0%, #38bdf8 30%, #f59e0b 78%, #f97316 100%)',
    accent: '#fde68a',
    glow: 'rgba(253, 230, 138, 0.45)',
    label: 'Sunny',
  };
}

/** Picks the lucide icon component for a condition + day/night. */
export function iconFor(condition, iconCode) {
  const night = typeof iconCode === 'string' && iconCode.endsWith('n');
  const key = (condition || '').toLowerCase();
  if (key.includes('thunder')) return CloudLightning;
  if (key.includes('rain')) return CloudRain;
  if (key.includes('drizzle')) return CloudDrizzle;
  if (key.includes('snow')) return CloudSnow;
  if (key.includes('mist') || key.includes('fog') || key.includes('haze'))
    return CloudFog;
  if (key.includes('cloud')) return night ? CloudMoon : CloudSun;
  if (key.includes('clear')) return night ? Moon : Sun;
  return Cloud;
}

export function formatTime(unixSeconds) {
  if (!unixSeconds) return '—';
  return new Date(unixSeconds * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

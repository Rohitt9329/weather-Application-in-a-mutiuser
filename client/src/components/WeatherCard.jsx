import React from 'react';
import { Star, Droplets, Wind, Eye, Trash2 } from 'lucide-react';
import './WeatherCard.css';

const weatherIcons = {
  'clear sky': '☀️',
  'mainly clear': '🌤️',
  'partly cloudy': '⛅',
  'overcast': '☁️',
  'fog': '🌫️',
  'depositing rime fog': '🌫️',
  'light drizzle': '🌦️',
  'moderate drizzle': '🌦️',
  'dense drizzle': '🌦️',
  'slight rain': '🌧️',
  'moderate rain': '🌧️',
  'heavy rain': '🌧️',
  'slight snow': '❄️',
  'moderate snow': '❄️',
  'heavy snow': '❄️',
  'slight rain showers': '🌦️',
  'moderate rain showers': '🌧️',
  'violent rain showers': '⛈️',
  'thunderstorm': '⛈️',
  'sunny': '☀️',
  'cloudy': '☁️',
  'rainy': '🌧️',
  'stormy': '⛈️',
  'snowy': '❄️',
  'clear': '☀️',
  default: '🌤️',
};

const WeatherCard = ({ city, onToggleFavorite, onDeleteCity }) => {
  const icon = weatherIcons[city.condition?.toLowerCase()] || weatherIcons.default;

  return (
    <div className={`weather-card ${city.isFavorite ? 'is-favorite' : ''}`}>
      <div className="card-header">
        <div>
          <div className="city-name">{city.name}</div>
          <div className="card-country">{city.country}</div>
        </div>
        <div className="card-actions" style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`favorite-btn ${city.isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(city.id)}
            aria-label={city.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={20} fill={city.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            className="delete-city-btn"
            onClick={() => onDeleteCity(city.id)}
            aria-label="Delete city"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="weather-icon-wrapper">
          {icon}
        </div>
        <div className="temp-section">
          <div className="temperature">
            {city.temp}<span className="unit">°C</span>
          </div>
          <div className="weather-condition">{city.condition || 'Clear Sky'}</div>
        </div>
      </div>

      <div className="card-footer">
        <div className="stat-item">
          <span className="stat-icon"><Droplets size={16} /></span>
          <span className="stat-value">{city.humidity}%</span>
          <span className="stat-label">Humidity</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon"><Wind size={16} /></span>
          <span className="stat-value">{city.wind} km/h</span>
          <span className="stat-label">Wind</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon"><Eye size={16} /></span>
          <span className="stat-value">{city.visibility || '10'} km</span>
          <span className="stat-label">Visibility</span>
        </div>
      </div>
    </div>
  );
};

/* Skeleton Loader Card */
export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-header">
      <div className="skeleton-line" style={{ width: '45%', height: '18px' }} />
      <div className="skeleton-line" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
    </div>
    <div className="skeleton-body">
      <div className="skeleton-line" style={{ width: '64px', height: '64px', borderRadius: '1rem' }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton-line" style={{ width: '60%', height: '36px', marginBottom: '8px' }} />
        <div className="skeleton-line" style={{ width: '40%', height: '14px' }} />
      </div>
    </div>
    <div className="skeleton-footer">
      <div className="skeleton-line" style={{ flex: 1, height: '42px', borderRadius: '8px' }} />
      <div className="skeleton-line" style={{ flex: 1, height: '42px', borderRadius: '8px' }} />
      <div className="skeleton-line" style={{ flex: 1, height: '42px', borderRadius: '8px' }} />
    </div>
  </div>
);

export default WeatherCard;

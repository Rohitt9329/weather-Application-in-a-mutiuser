import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AddCityForm from '../components/AddCityForm';
import WeatherCard, { SkeletonCard } from '../components/WeatherCard';
import { Plus, RefreshCw, AlertTriangle, CloudOff, LayoutGrid, Star, Brain } from 'lucide-react';
import './Dashboard.css';
import { cityService, insightService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cities, setCities] = useState([]);
  const [insights, setInsights] = useState(null);
  const [viewFilter, setViewFilter] = useState('all'); // 'all' | 'favorites'
  const [uiState, setUiState] = useState('loading'); // 'loading' | 'loaded' | 'empty' | 'error'
  const navigate = useNavigate();

  /* Load cities from API */
  const fetchCities = async () => {
    try {
      setUiState('loading');
      const data = await cityService.getCities();
      
      // Map backend data to frontend format
      const formattedCities = data.cities.map(c => ({
        id: c.id,
        name: c.name,
        country: c.country,
        temp: c.weather?.temperature ?? '—',
        condition: c.weather?.condition ?? 'Unknown',
        humidity: c.weather?.humidity ?? '—',
        wind: c.weather?.windSpeed ?? '—',
        visibility: c.weather?.visibility ?? '—',
        isFavorite: c.isFavorite
      }));
      
      setCities(formattedCities);
      setUiState(formattedCities.length > 0 ? 'loaded' : 'empty');
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setUiState('error');
      }
    }
  };

  /* Load insights from API */
  const fetchInsights = async () => {
    try {
      setUiState('loading');
      const data = await insightService.getInsights();
      setInsights(data.insights);
      setUiState('loaded');
    } catch (err) {
      console.error('Insights fetch error:', err);
      setUiState('error');
    }
  };

  useEffect(() => {
    if (activeTab === 'insights') {
      fetchInsights();
    } else if (activeTab === 'dashboard' || activeTab === 'favorites') {
      fetchCities();
    }
  }, [activeTab]);

  /* Dark mode toggle */
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      document.documentElement.setAttribute('data-theme', !prev ? 'dark' : 'light');
      return !prev;
    });
  };

  /* Favorite toggle */
  const toggleFavorite = async (id) => {
    try {
      const city = cities.find(c => c.id === id);
      if (!city) return;

      const updated = await cityService.updateCity(id, { isFavorite: !city.isFavorite });
      
      setCities((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFavorite: updated.city.isFavorite } : c))
      );
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  /* Add city */
  const handleAddCity = async (name) => {
    try {
      setUiState('loading');
      const data = await cityService.addCity(name);
      const newCity = {
        id: data.city.id,
        name: data.city.name,
        country: data.city.country,
        temp: data.city.weather?.temperature ?? '—',
        condition: data.city.weather?.condition ?? 'Unknown',
        humidity: data.city.weather?.humidity ?? '—',
        wind: data.city.weather?.windSpeed ?? '—',
        visibility: data.city.weather?.visibility ?? '—',
        isFavorite: data.city.isFavorite
      };
      setCities((prev) => [newCity, ...prev]);
      setUiState('loaded');
      setViewFilter('all');
    } catch (err) {
      console.error('Failed to add city:', err);
      alert(err.response?.data?.message || 'Failed to add city');
      setUiState(cities.length > 0 ? 'loaded' : 'empty');
    }
  };

  /* Delete city */
  const handleDeleteCity = async (id) => {
    if (!window.confirm('Are you sure you want to remove this city?')) return;
    
    try {
      await cityService.deleteCity(id);
      setCities((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete city:', err);
      alert('Failed to delete city. Please try again.');
    }
  };

  /* Filtered cities */
  const displayedCities =
    viewFilter === 'favorites' ? cities.filter((c) => c.isFavorite) : cities;
  const favoriteCount = cities.filter((c) => c.isFavorite).length;

  /* ── Render content based on active sidebar tab ── */
  const renderContent = () => {
    if (activeTab === 'insights') {
      return (
        <div className="insights-panel">
          <h1 className="dashboard-heading">AI Weather Insights</h1>
          <p className="dashboard-subtitle">Personalized planning guidance based on your cities</p>

          {uiState === 'loaded' && insights && (
            <div className="insights-content">
              <div className="insights-summary-card">
                <div className="insight-card-header">
                  <Brain className="insight-icon" size={24} color="var(--primary)" />
                  <h3>Planner Summary</h3>
                </div>
                <p className="summary-text">{insights.summary}</p>
              </div>

              <div className="recommendations-grid">
                {insights.recommendations.map((rec, idx) => (
                  <div key={idx} className="recommendation-card">
                    <div className="rec-header">
                      <span className="rec-city">{rec.city}</span>
                      <span className={`comfort-badge ${rec.label}`}>{rec.label}</span>
                    </div>
                    <div className="rec-weather">
                      <span className="rec-temp">{rec.temperature}°C</span>
                      <span className="rec-condition">{rec.condition}</span>
                    </div>
                    <p className="rec-text">{rec.recommendation}</p>
                  </div>
                ))}
              </div>
              
              <div className="insights-footer">
                <p>{insights.limitations}</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'settings') {
      return (
        <div className="settings-panel">
          <h1 className="dashboard-heading">Settings</h1>
          <p className="dashboard-subtitle">Customize your dashboard preferences</p>

          <div className="settings-card">
            <h4>Appearance</h4>
            <div className="setting-row">
              <span className="setting-label">Dark Mode</span>
              <button
                className={`toggle-switch ${darkMode ? 'active' : ''}`}
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
              />
            </div>
          </div>

          <div className="settings-card">
            <h4>Weather</h4>
            <div className="setting-row">
              <span className="setting-label">Temperature Unit</span>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>°C</span>
            </div>
            <div className="setting-row">
              <span className="setting-label">Auto-refresh</span>
              <button className="toggle-switch active" aria-label="Toggle auto-refresh" />
            </div>
          </div>

        </div>
      );
    }

    /* Dashboard / Favorites tab */
    const isOnFavorites = activeTab === 'favorites';

    return (
      <>
        <h1 className="dashboard-heading">
          {isOnFavorites ? 'Your Favorites' : 'Your Weather Dashboard'}
        </h1>
        <p className="dashboard-subtitle">
          {isOnFavorites
            ? `You have ${favoriteCount} favorite ${favoriteCount === 1 ? 'city' : 'cities'}`
            : 'Track real-time weather for cities around the world'}
        </p>

        {!isOnFavorites && <AddCityForm onAddCity={handleAddCity} isLoading={uiState === 'loading'} />}

        {/* Filter Tabs (only on main dashboard) */}
        {!isOnFavorites && (
          <div className="tab-filter-bar">
            <button
              className={`tab-filter-btn ${viewFilter === 'all' ? 'active' : ''}`}
              onClick={() => setViewFilter('all')}
            >
              <LayoutGrid size={14} /> All Cities
            </button>
            <button
              className={`tab-filter-btn ${viewFilter === 'favorites' ? 'active' : ''}`}
              onClick={() => setViewFilter('favorites')}
            >
              <Star size={14} /> Favorites
              {favoriteCount > 0 && (
                <span className="favorite-count-badge">{favoriteCount}</span>
              )}
            </button>
          </div>
        )}

        {/* Loading State */}
        {uiState === 'loading' && (
          <div className="cards-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {uiState === 'error' && (
          <div className="error-state">
            <div className="error-card">
              <div className="error-icon">
                <AlertTriangle size={26} />
              </div>
              <h3>Something went wrong</h3>
              <p>We couldn't fetch the weather data. Please check your connection and try again.</p>
              <button className="retry-btn" onClick={() => setUiState('loaded')}>
                <RefreshCw size={16} /> Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {uiState === 'empty' && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <CloudOff size={42} strokeWidth={1.5} color="var(--text-muted)" />
            </div>
            <h3>No cities added yet</h3>
            <p>Start by searching for a city above to see live weather updates on your dashboard.</p>
            <button className="empty-state-btn" onClick={() => { setUiState('loaded'); document.getElementById('city-search-input')?.focus(); }}>
              <Plus size={18} /> Add Your First City
            </button>
          </div>
        )}

        {/* Loaded State */}
        {uiState === 'loaded' && (
          <>
            {(isOnFavorites ? cities.filter((c) => c.isFavorite) : displayedCities).length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  {isOnFavorites ? '⭐' : <CloudOff size={42} strokeWidth={1.5} color="var(--text-muted)" />}
                </div>
                <h3>{isOnFavorites ? 'No favorites yet' : 'No cities added yet'}</h3>
                <p>
                  {isOnFavorites
                    ? 'Star a city card to add it to your favorites list.'
                    : 'Search for a city above to get started.'}
                </p>
              </div>
            ) : (
              <div className="cards-grid">
                {(isOnFavorites ? cities.filter((c) => c.isFavorite) : displayedCities).map((city) => (
                  <WeatherCard 
                    key={city.id} 
                    city={city} 
                    onToggleFavorite={toggleFavorite} 
                    onDeleteCity={handleDeleteCity}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <div>
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
      />
      <div className="dashboard-layout">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'favorites') setViewFilter('all');
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

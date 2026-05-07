import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import './AddCityForm.css';

const AddCityForm = ({ onAddCity, isLoading }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() && !isLoading) {
      onAddCity(city.trim());
      setCity('');
    }
  };

  return (
    <form className="add-city-form" onSubmit={handleSubmit} id="add-city-form">
      <div className="search-input-wrapper">
        <span className="search-icon"><Search size={18} /></span>
        <input
          className="search-input"
          type="text"
          placeholder={isLoading ? "Adding city..." : "Search city... e.g. Mumbai, London"}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          id="city-search-input"
          disabled={isLoading}
        />
      </div>
      <button type="submit" className="add-city-btn" id="add-city-btn" disabled={isLoading || !city.trim()}>
        {isLoading ? (
          <div className="btn-spinner" />
        ) : (
          <>
            <Plus size={18} />
            Add City
          </>
        )}
      </button>
    </form>
  );
};

export default AddCityForm;

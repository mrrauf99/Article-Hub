import { useState, useRef, useEffect } from "react";
import { COUNTRIES } from "../../util/countries";

import "../../styles/auth/CountryDropdown.css";

export default function CountryDropdown({ value, onChange, hasError, onBlur }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const dropdownRef = useRef(null);

  // Filter countries based on search term
  const filteredCountries = COUNTRIES.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        // Only trigger blur/validation if the dropdown was actually opened before
        if (hasBeenOpened && onBlur) {
          onBlur();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur, hasBeenOpened]);

  const handleCountrySelect = (country) => {
    if (onChange) {
      // Create a synthetic event object that mimics event.target.value
      onChange({ target: { value: country } });
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleDropdownClick = () => {
    // Mark as opened when user first clicks the dropdown
    if (!isOpen && !hasBeenOpened) {
      setHasBeenOpened(true);
    }

    if (isOpen && onBlur) {
      // Trigger validation when closing dropdown
      onBlur();
    }
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchTerm("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const displayValue = value || "Select a country";
  const isPlaceholder = !value || value === "Select a country";

  return (
    <div ref={dropdownRef} className="country-dropdown-container">
      <label>Country/Region</label>

      {/* Main Dropdown Button */}
      <div className="country-dropdown-wrapper">
        <div onClick={handleDropdownClick} className="country-input">
          <span
            className={isPlaceholder ? "placeholder-value" : "selected-value"}
          >
            {displayValue}
          </span>
          <svg
            className={`dropdown-arrow ${isOpen ? "open" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="dropdown-menu">
            {/* Search Box */}
            <div className="search-container">
              <svg
                className="search-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
                autoFocus
              />
            </div>

            {/* Countries List */}
            <div className="countries-list">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <div
                    key={country}
                    onClick={() => handleCountrySelect(country)}
                    className={`country-item ${
                      country === value ? "selected" : ""
                    }`}
                  >
                    {country}
                  </div>
                ))
              ) : (
                <div className="no-results">No countries found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {hasError && <p className="error-msg">Please fill out this field.</p>}
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { COUNTRIES } from "../util/countries";

import styles from "../styles/CountryDropdown.module.css";

export default function CountryDropdown({ value, onChange, hasError, onBlur }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const dropdownRef = useRef(null);

  const filteredCountries = COUNTRIES.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
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
      onChange({ target: { value: country } });
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleDropdownClick = () => {
    if (!isOpen && !hasBeenOpened) {
      setHasBeenOpened(true);
    }
    if (isOpen && onBlur) {
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
    <div ref={dropdownRef} className="relative">
      <label className={styles.label}>Country/Region</label>

      <div className="relative">
        <div
          onClick={handleDropdownClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleDropdownClick();
            }
          }}
          tabIndex={0}
          role="button"
          className={styles.input}
        >
          <span
            className={
              isPlaceholder ? styles.placeholderValue : styles.selectedValue
            }
          >
            {displayValue}
          </span>
          <svg
            className={`${styles.dropdownArrow} ${isOpen ? styles.open : ""}`}
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

        {isOpen && (
          <div className={styles.dropdownMenu}>
            <div className={styles.searchContainer}>
              <svg
                className={styles.searchIcon}
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
                className={styles.searchInput}
                autoFocus
              />
            </div>

            <div className={styles.countriesList}>
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <div
                    key={country}
                    onClick={() => handleCountrySelect(country)}
                    className={`${styles.countryItem} ${
                      country === value ? styles.selected : ""
                    }`}
                  >
                    {country}
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>No countries found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {hasError && (
        <p className={styles.errorMsg}>Please fill out this field.</p>
      )}
    </div>
  );
}

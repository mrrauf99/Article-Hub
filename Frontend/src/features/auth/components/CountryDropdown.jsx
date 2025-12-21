import { useState, useRef, useEffect } from "react";
import { COUNTRIES } from "../data/countries";
import { Search } from "lucide-react";
import styles from "../styles/CountryDropdown.module.css";

export default function CountryDropdown({
  name = "country",
  value,
  onChange,
  onBlur,
  hasError,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredCountries = COUNTRIES.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------- Close on outside click ---------------- */

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (isOpen) {
          setIsOpen(false);
          setSearchTerm("");
          onBlur?.({ target: { name } });
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onBlur, name]);

  /* ---------------- Handlers ---------------- */

  const handleToggle = () => {
    setIsOpen((v) => !v);
    if (!isOpen) setSearchTerm("");
  };

  const handleSelect = (country) => {
    onChange?.({ target: { name, value: country } });
    setIsOpen(false);
    setSearchTerm("");
    onBlur?.({ target: { name } });
  };

  const displayValue = value || "Select a country";
  const isPlaceholder = !value;

  return (
    <div ref={dropdownRef} className="relative">
      <label className={styles.label}>Country/Region</label>

      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        className={`${styles.input} ${hasError ? styles.inputError : ""}`}
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
            {/* Search icon */}
            <Search className={styles.searchIcon} />

            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>

          <div className={styles.countriesList}>
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country}
                  onClick={() => handleSelect(country)}
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

      {hasError && (
        <p className={styles.errorMsg}>Please fill out this field.</p>
      )}
    </div>
  );
}

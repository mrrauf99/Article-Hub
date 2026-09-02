import { useState, useRef, useEffect } from "react";
import { COUNTRIES } from "../data/countries";
import { Globe, Search, ChevronDown } from "lucide-react";
import styles from "../styles/CountryDropdown.module.css";

export default function CountryDropdown({
  name = "country",
  id,
  value,
  onChange,
  onBlur,
  hasError,
  required,
}) {
  const triggerId = id || name;
  const errorId = `${triggerId}-error`;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredCountries = COUNTRIES.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (isOpen) {
          setIsOpen(false);
          setSearchTerm("");
          onBlur?.({ target: { name, value } });
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onBlur, name, value]);

  const handleToggle = () => {
    setIsOpen((v) => !v);
    if (!isOpen) setSearchTerm("");
  };

  const handleSelect = (country) => {
    onChange?.({ target: { name, value: country } });
    setIsOpen(false);
    setSearchTerm("");
    onBlur?.({ target: { name, value: country } });
  };

  const displayValue = value || "Select a country";
  const isPlaceholder = !value;

  return (
    <div ref={dropdownRef} className="relative">
      <label htmlFor={triggerId} className={styles.label}>
        Country/Region
      </label>

      <div
        id={triggerId}
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggle();
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required || undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? errorId : undefined}
        className={`${styles.input} ${hasError ? styles.inputError : ""}`}
      >
        <Globe className="w-5 h-5 text-ink-faint" aria-hidden="true" />

        <span
          className={
            isPlaceholder ? styles.placeholderValue : styles.selectedValue
          }
        >
          {displayValue}
        </span>
        <ChevronDown
          className={`${styles.dropdownArrow} ${isOpen ? styles.open : ""}`}
          size={20}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.searchContainer}>
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
        <p id={errorId} className={styles.errorMsg}>
          Please fill out this field.
        </p>
      )}
    </div>
  );
}

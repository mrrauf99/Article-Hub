import { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown, Check } from "lucide-react";
import { createPortal } from "react-dom";

/**
 * Reusable Category Filter Dropdown Component
 * @param {Object} props
 * @param {string[]} props.categories - Array of category names
 * @param {string} props.activeCategory - Currently selected category
 * @param {function} props.onChange - Callback when category changes
 * @param {string} props.variant - 'light' | 'dark' - Theme variant
 * @param {string} props.className - Additional classes
 * @param {string} props.triggerLabel - Custom label for trigger button (e.g., '+10 more')
 * @param {string} props.placeholder - Placeholder text when no category selected
 */
export default function CategoryFilter({
  categories,
  activeCategory,
  onChange,
  onBlur,
  variant = "light",
  className = "",
  triggerLabel = null,
  placeholder = "Select category",
  name = "",
  error = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        // Trigger onBlur when closing without selection
        if (onBlur && name) {
          onBlur({ target: { name, value: activeCategory } });
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur, name, activeCategory]);

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 240;
      // Position dropdown to the right edge of the button, ensuring it doesn't go off screen
      let left = rect.right - dropdownWidth;
      if (left < 16) left = 16; // Minimum 16px from left edge

      setDropdownPosition({
        top: rect.bottom + 8,
        left: left,
        width: dropdownWidth,
      });
    }
  }, [isOpen]);

  // Close dropdown on window scroll (but not dropdown internal scroll)
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (e) => {
      // Don't close if scrolling inside the dropdown
      if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
        return;
      }
      setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen]);

  const handleSelect = (category) => {
    onChange(category);
    setIsOpen(false);
  };

  const isDark = variant === "dark";

  // Filter out empty strings from categories for display
  const displayCategories = categories.filter((cat) => cat !== "");

  const dropdownMenu = isOpen && (
    <div
      ref={dropdownRef}
      style={{
        position: "fixed",
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        maxWidth: "calc(100vw - 2rem)",
        zIndex: 9999,
      }}
      className={`py-2 rounded-xl shadow-2xl border ${
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}
    >
      <div
        className="max-h-64 overflow-y-scroll"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: isDark ? "#64748b #1e293b" : "#94a3b8 #f1f5f9",
          paddingRight: "4px",
        }}
      >
        {displayCategories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => handleSelect(category)}
            className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 text-left transition-colors focus:outline-none ${
              activeCategory === category
                ? isDark
                  ? "bg-sky-500/20 text-sky-400"
                  : "bg-sky-50 text-sky-600"
                : isDark
                ? "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className="font-medium">{category}</span>
            {activeCategory === category && (
              <Check className="w-4 h-4 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  // Check if using custom trigger label (like '+10 more')
  const isMoreButton = triggerLabel !== null;

  // Error styling classes
  const errorClasses = error ? "border-red-300 bg-red-50" : "";

  return (
    <div
      className={`relative ${
        isMoreButton ? "inline-block" : "w-full"
      } ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={
          isMoreButton
            ? `flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none ${
                isDark
                  ? "bg-slate-700/80 text-slate-300 hover:bg-slate-600 hover:text-white border border-slate-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300"
              }`
            : `flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-[0.9375rem] font-normal transition-all duration-200 w-full shadow-sm ${
                isDark
                  ? "bg-slate-800/80 border border-slate-700 text-white hover:bg-slate-700"
                  : `bg-white border text-slate-700 hover:border-slate-400 ${
                      error ? "border-red-300" : "border-slate-300"
                    }`
              }`
        }
      >
        <span className={isMoreButton ? "" : "truncate pl-1"}>
          {triggerLabel || activeCategory || placeholder}
        </span>
        {!isMoreButton && (
          <div className="flex items-center gap-1.5">
            <Filter
              className={`w-4 h-4 ${
                isDark ? "text-slate-400" : "text-slate-400"
              }`}
            />
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              } ${isDark ? "text-slate-400" : "text-slate-400"}`}
            />
          </div>
        )}
        {isMoreButton && (
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            } ${isDark ? "text-slate-400" : "text-slate-500"}`}
          />
        )}
      </button>

      {/* Dropdown Menu - rendered via portal to avoid overflow issues */}
      {createPortal(dropdownMenu, document.body)}
    </div>
  );
}

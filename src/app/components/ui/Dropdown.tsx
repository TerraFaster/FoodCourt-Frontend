import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  icon?: string; // For emoji or other icons
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  showSelectedIndicator?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select option",
  icon,
  className = "",
  showSelectedIndicator = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration to complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const currentOption = options.find(option => option.value === value);
  const displayValue = isHydrated ? (currentOption?.label || placeholder) : placeholder;

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-all duration-300"
        style={{ backgroundColor: '#111111', borderColor: '#333333' }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.borderColor = '#444444';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.borderColor = '#333333';
        }}
      >
        <div className="flex items-center space-x-2">
          {icon && icon}
          {currentOption?.icon && <span className="text-base">{currentOption.icon}</span>}
          <span className="text-sm font-medium">{displayValue}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                     style={{ color: '#888888' }} />
      </button>
      
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl shadow-2xl z-50 backdrop-blur-sm border border-gray-600/30 overflow-hidden" 
             style={{ backgroundColor: 'rgba(26, 26, 26, 0.95)' }}>
          {options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              className={`flex items-center cursor-pointer gap-3 w-full text-left px-4 py-3 text-sm transition-all duration-300 relative ${
                isHydrated && value === option.value 
                  ? 'text-yellow-400 bg-yellow-400/10 border-l-4 border-yellow-400' 
                  : 'text-white hover:bg-white/10'
              } ${index === 0 ? 'rounded-t-2xl' : ''} ${index === options.length - 1 ? 'rounded-b-2xl' : ''}`}
              onMouseEnter={(e) => {
                if (!isHydrated || value !== option.value) {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isHydrated || value !== option.value) {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                }
              }}
            >
              {option.icon && <span className="text-base">{option.icon}</span>}
              <span className="font-medium">{option.label}</span>
              {showSelectedIndicator && isHydrated && value === option.value && (
                <div className="absolute right-3 w-2 h-2 bg-yellow-400 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
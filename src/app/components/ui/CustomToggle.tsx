'use client';

export function CustomToggle({ 
  checked, 
  onChange, 
  label, 
  disabled = false 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  label: string; 
  disabled?: boolean;
}) {
  return (
    <label className={`flex items-center space-x-3 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
      <div 
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
          checked 
            ? 'bg-yellow-400 shadow-lg shadow-yellow-400/25' 
            : 'bg-gray-600'
        } ${!disabled && 'hover:shadow-lg hover:shadow-yellow-400/10'}`}
        onClick={() => !disabled && onChange(!checked)}
      >
        <div
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ease-in-out shadow-sm ${
            checked 
              ? 'translate-x-6 shadow-md' 
              : 'translate-x-1'
          }`}
        />
        {/* Glow effect when active */}
        {checked && (
          <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 blur-sm"></div>
        )}
      </div>
      <span className="text-sm font-medium" style={{ color: '#cccccc' }}>
        {label}
      </span>
    </label>
  );
}
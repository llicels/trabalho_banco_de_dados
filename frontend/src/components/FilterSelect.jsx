import ArrowDownIcon from './icons/ArrowDownIcon';

export function FilterSelect({ 
  label, 
  value, 
  onChange, 
  options = [], 
  className = "" 
}) {
  const normalizedOptions = options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option
  );

  return (
    <div className={`relative ${className}`}>
    
      <label className="text-xs font-bold text-Grey mb-1 uppercase tracking-wide block">
        {label}
      </label>
      
      <div className="relative">
        <select 
          value={value} 
          onChange={onChange}
          className="block w-full h-10 pl-3 pr-10 border border-Grey rounded-lg bg-white text-sm text-Black font-medium focus:ring-2 focus:ring-Blue1 focus:border-Blue1 outline-none appearance-none cursor-pointer"
        >
          {normalizedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ArrowDownIcon className="w-4 h-4 text-DarkGrey" />
        </div>
      </div>

    </div>
  );
}
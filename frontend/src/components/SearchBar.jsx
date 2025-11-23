export function SearchBar({ 
  placeholder = "Buscar...", 
  onSearch,                       
  className = ""             
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="bg-PureWhite rounded-full shadow-sm border border-LightGrey flex items-center px-4 h-12 focus-within:ring-2 focus-within:ring-Blue1 transition-shadow">
        
        {/* Ícone Lupa (SVG Inline) */}
        
        
        {/* Input Real */}
        <input 
          type="text" 
          placeholder={placeholder}
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 text-Black placeholder-Grey outline-none w-full"
        />

      </div>
    </div>
  );
}
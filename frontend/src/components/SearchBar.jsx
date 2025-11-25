import SearchIcon from "./icons/SearchIcon"; 

export function SearchBar({ 
  placeholder = "Buscar...", 
  onSearch,
  onSubmit,
  showFilter = true,         
  className = ""             
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="bg-PureWhite rounded-full shadow-sm border border-LightGrey flex items-center px-4 h-12 focus-within:ring-2 focus-within:ring-Blue1 transition-shadow">
        
        <SearchIcon className="w-5 h-5 text-Grey mr-3 shrink-0" />
        
        <input 
          type="text" 
          placeholder={placeholder}
          // Evento enquanto digita
          onChange={(e) => onSearch && onSearch(e.target.value)}
          
          // Evento de Teclado (Detecta o Enter)
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSubmit) {
              onSubmit(e.target.value);
            }
          }}
          className="flex-1 bg-transparent border-none focus:ring-0 text-Black placeholder-Grey outline-none w-full"
        />

      </div>
    </div>
  );
}
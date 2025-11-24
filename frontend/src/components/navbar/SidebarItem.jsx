export function SidebarItem({ 
  icon: Icon, 
  isActive, 
  onClick,
  iconClassName='w-7 h-7' //valor padrão
}) {
  return (
    <button
      onClick={onClick}
      className={`
        p-3 rounded-xl flex justify-center transition-all duration-200 cursor-pointer
        ${isActive 
          ? 'bg-Blue3 text-white shadow-md'
          : 'text-white hover:bg-Blue3'
        }
      `}
    >
      <Icon className={iconClassName} />
    </button>
  );
}
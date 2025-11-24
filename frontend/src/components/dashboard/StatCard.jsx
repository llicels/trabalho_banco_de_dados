export function StatCard({ title, value, label, footerContent, isAlert = false, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-PureWhite p-6 rounded-2xl shadow-sm border border-LightGrey flex flex-col justify-between h-full hover:shadow-md transition-all cursor-pointer hover:border-Blue1"
    >
  
      <div className="text-Black font-bold text-lg">
        <span>{title}</span>
      </div>

      <div className="text-center mt-4">
        <div className={`text-5xl font-bold ${isAlert ? 'text-Red' : 'text-Black'}`}>
          {value}
        </div>
        {label && (
          <div className={`text-lg mt-1 font-bold ${isAlert ? 'text-Red' : 'text-Black'}`}>
            {label}
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        {footerContent}
      </div>
    </div>
  );
}
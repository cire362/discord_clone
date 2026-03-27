function ServerSidebar() {
  return (
    <div className="w-[72px] flex flex-col items-center py-3 bg-gray-900 border-r border-gray-800 shrink-0 z-20">
      {/* Главная иконка */}
      <div className="w-12 h-12 bg-indigo-500 hover:bg-indigo-400 rounded-[24px] hover:rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center shadow-lg shadow-indigo-500/30">
        <span className="font-bold text-white text-lg">M</span>
      </div>

      <div className="w-8 h-[2px] bg-gray-800 my-3 rounded-full"></div>

      {/* Иконки серверов */}
      <div className="w-12 h-12 bg-gray-800 hover:bg-indigo-500 rounded-[24px] hover:rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center text-gray-400 hover:text-white mb-2 group">
        <span className="font-semibold group-hover:scale-110 transition-transform">
          CS
        </span>
      </div>
      <div className="w-12 h-12 bg-gray-800 hover:bg-indigo-500 rounded-[24px] hover:rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center text-gray-400 hover:text-white group">
        <span className="font-semibold group-hover:scale-110 transition-transform">
          HD2
        </span>
      </div>
    </div>
  );
}

export default ServerSidebar;

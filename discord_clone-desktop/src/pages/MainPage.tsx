function MainPage() {
  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-100 overflow-hidden font-sans">
      {/* 1. ПАНЕЛЬ СЕРВЕРОВ */}
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

      {/* 2. ПАНЕЛЬ КАНАЛОВ */}
      <div className="w-60 flex flex-col bg-gray-800 border-r border-gray-700/50 shrink-0 z-10 relative">
        {/* Шапка сервера */}
        <div className="h-12 flex items-center px-4 border-b border-gray-900 shadow-sm cursor-pointer hover:bg-gray-700/50 transition">
          <h1 className="font-bold text-gray-100 truncate">Gaming Squad</h1>
        </div>

        {/* Список каналов */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 mt-2">
          {["общий", "поиск-пати", "новости", "флуд"].map((channel, idx) => (
            <button
              key={channel}
              className={`w-full flex items-center px-2 py-1.5 rounded transition-colors group ${idx === 0 ? "bg-gray-700/60 text-gray-100" : "text-gray-400 hover:text-gray-100 hover:bg-gray-700/30"}`}
            >
              <span className="text-xl mr-1.5 text-gray-500 group-hover:text-gray-300">
                #
              </span>
              <span className="truncate">{channel}</span>
            </button>
          ))}
        </div>

        {/* Профиль пользователя  */}
        <div className="h-14 bg-gray-900/50 border-t border-gray-700/50 flex items-center px-3 backdrop-blur-sm mt-auto">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold mr-2 shadow-sm shadow-indigo-500/20 relative">
            K
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
          <div className="flex flex-col text-sm truncate flex-1">
            <span className="font-bold text-gray-100 leading-tight">
              Kirill
            </span>
            <span className="text-xs text-gray-400">@MortaliTy188</span>
          </div>
        </div>
      </div>

      {/* 3. ЗОНА ЧАТА */}
      <div className="flex flex-1 flex-col bg-[#1e1f24] relative">
        <div className="h-12 flex items-center px-4 border-b border-gray-800 bg-[#1e1f24]/80 backdrop-blur-md absolute top-0 w-full z-10">
          <span className="text-xl text-gray-500 mr-2">#</span>
          <h2 className="font-bold text-gray-100">общий</h2>
        </div>

        {/* Область сообщений */}
        <div className="flex-1 overflow-y-auto p-4 pt-16 pb-24">
          <div className="text-center text-gray-500 my-4 text-sm">
            Добро пожаловать в начало канала #общий.
          </div>

          {/* Пример сообщения */}
          <div className="flex mt-6 hover:bg-gray-800/30 p-2 rounded transition-colors -mx-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5">
              JS
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="font-bold text-indigo-400 mr-2 cursor-pointer hover:underline">
                  System
                </span>
                <span className="text-xs text-gray-500">Сегодня в 19:14</span>
              </div>
              <p className="text-gray-300 mt-1">
                Настройки стилей загружены успешно. Формы работают, токен
                сохраняется! 🚀
              </p>
            </div>
          </div>
        </div>

        {/* Поле ввода сообщения */}
        <div className="absolute bottom-0 w-full p-4 bg-[#1e1f24] pt-2">
          <div className="bg-gray-800 border border-gray-700/50 rounded-lg flex items-center px-4 py-3 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition shadow-lg">
            <button className="text-gray-400 hover:text-indigo-400 transition mr-3">
              {/* Плюсик для загрузки файлов */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
            </button>
            <input
              type="text"
              placeholder="Написать в #общий"
              className="bg-transparent text-gray-100 w-full focus:outline-none placeholder-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;

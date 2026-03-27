interface NavigationSidebarProps {
  setActiveChat: (msg: string) => void;
  activeChat: string;
  conversations: any;
  isLoading: boolean;
}

function NavigationSidebar({
  activeChat,
  isLoading,
  conversations,
  setActiveChat,
}: NavigationSidebarProps) {
  return (
    <div className="w-60 flex flex-col bg-gray-800 border-r border-gray-700/50 shrink-0 z-10 relative">
      {/* Шапка сервера */}
      <div className="h-12 flex items-center px-4 border-b border-gray-900 shadow-sm cursor-pointer hover:bg-gray-700/50 transition">
        <h1 className="font-bold text-gray-100 truncate">
          {activeChat === "friends" ? "Друзья" : "Выбранный канал"}
        </h1>
      </div>

      {/* Список каналов */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 mt-2">
        {isLoading
          ? "Загрузка..."
          : conversations?.err
            ? "Нет активных диалогов"
            : conversations?.conversations?.map((conv: any, idx: number) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveChat(conv.id)}
                  className={`w-full flex items-center px-2 py-1.5 rounded transition-colors group ${idx === 0 ? "bg-gray-700/60 text-gray-100" : "text-gray-400 hover:text-gray-100 hover:bg-gray-700/30"}`}
                >
                  <span className="text-xl mr-1.5 text-gray-500 group-hover:text-gray-300">
                    #
                  </span>
                  <span className="truncate">Диалог {conv.id}</span>
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
          <span className="font-bold text-gray-100 leading-tight">Kirill</span>
          <span className="text-xs text-gray-400">@MortaliTy188</span>
        </div>
      </div>
    </div>
  );
}

export default NavigationSidebar;

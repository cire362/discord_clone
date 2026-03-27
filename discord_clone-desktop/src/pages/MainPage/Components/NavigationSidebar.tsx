import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../../api/users";
import FriendIcon from "../../../components/Icons/friendIcon";
import LogoutIcon from "../../../components/Icons/logoutIcon";

interface NavigationSidebarProps {
  setActiveChat: (msg: any) => void;
  activeChat: any;
  conversations: any;
  isLoading: boolean;
}

function NavigationSidebar({
  activeChat,
  isLoading,
  conversations,
  setActiveChat,
}: NavigationSidebarProps) {
  let currentUserId = -1;
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserId = payload.id;
    } catch (e) {}
  }

  const { data: userData } = useQuery({
    queryKey: ["currentUser", currentUserId],
    queryFn: () => getUserById(currentUserId),
    enabled: currentUserId !== -1,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const currentUser = userData?.user;

  return (
    <div className="w-60 flex flex-col bg-gray-800 border-r border-gray-700/50 shrink-0 z-10 relative">
      <div className="h-12 flex items-center px-4 border-b border-gray-900 shadow-sm cursor-pointer hover:bg-gray-700/50 transition">
        <h1 className="font-bold text-gray-100 truncate">Главное меню</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 mt-2 flex flex-col gap-1">
        <button
          onClick={() => setActiveChat("friends")}
          className={`w-full flex items-center px-2 py-2 rounded transition-colors group mb-4 ${
            activeChat === "friends"
              ? "bg-indigo-500/20 text-indigo-400"
              : "text-gray-400 hover:text-gray-100 hover:bg-gray-700/30"
          }`}
        >
          <div className="mr-3 opacity-80 group-hover:opacity-100">
            <FriendIcon />
          </div>
          <span className="font-semibold">Друзья</span>
        </button>

        <h3 className="text-xs uppercase font-bold text-gray-500 px-2 flex items-center gap-2 mb-1">
          <span>Личные сообщения</span>
        </h3>

        {isLoading ? (
          <div className="text-xs text-gray-400 px-2 mt-2">Загрузка...</div>
        ) : conversations?.message === "Диалоги не найдены" ||
          conversations?.err ? (
          <div className="text-xs text-gray-400 px-2 mt-2">
            Нет активных диалогов
          </div>
        ) : (
          conversations?.conversations?.map((conv: any) => {
            const otherUser =
              conv.users?.find((u: any) => u.id !== currentUserId) ||
              conv.users?.[0] ||
              {};
            const isActive =
              typeof activeChat === "object" && activeChat?.id === otherUser.id;

            return (
              <button
                key={conv.id}
                onClick={() =>
                  setActiveChat({
                    id: otherUser.id,
                    nickname: otherUser.nickname,
                  })
                }
                className={`w-full flex items-center px-2 py-1.5 rounded transition-colors group ${
                  isActive
                    ? "bg-gray-700/60 text-gray-100"
                    : "text-gray-400 hover:text-gray-100 hover:bg-gray-700/30"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white shadow-sm mr-2 text-xs flex-shrink-0">
                  {otherUser.nickname
                    ? otherUser.nickname[0].toUpperCase()
                    : "U"}
                </div>
                <span className="truncate">
                  {otherUser.nickname || `Диалог ${conv.id}`}
                </span>
              </button>
            );
          })
        )}
      </div>

      <div className="h-14 bg-gray-900/50 border-t border-gray-700/50 flex flex-row items-center justify-between px-3 backdrop-blur-sm mt-auto w-full">
        <div className="flex items-center min-w-0 pr-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold mr-2 shadow-sm shadow-indigo-500/20 relative flex-shrink-0 text-white">
            {currentUser ? currentUser.nickname[0].toUpperCase() : "..."}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
          <div className="flex flex-col text-sm truncate">
            <span className="font-bold text-gray-100 leading-tight truncate">
              {currentUser ? currentUser.nickname : "Загрузка..."}
            </span>
            <span className="text-xs text-gray-400 truncate">
              {currentUser ? `@${currentUser.login}` : "..."}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Выйти"
          className="text-gray-400 hover:text-red-400 p-2 rounded-md hover:bg-gray-800 transition flex-shrink-0"
        >
          <LogoutIcon />
        </button>
      </div>
    </div>
  );
}

export default NavigationSidebar;

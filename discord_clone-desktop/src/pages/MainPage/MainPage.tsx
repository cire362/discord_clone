import { useQuery } from "@tanstack/react-query";
import { getConversations } from "../../api/conversations";
import { useState } from "react";
import ServerSidebar from "./Components/ServerSidebar";
import NavigationSidebar from "./Components/NavigationSidebar";
import FriendsScreen from "./Components/FriendsScreen";
import ChatScreen from "./Components/ChatScreen";

function MainPage() {
  const [activeChat, setActiveChat] = useState<string>("friends");

  const { data: conversations, isLoading } = useQuery({
    queryFn: () => getConversations(),
    queryKey: ["conversations"],
    staleTime: 30000,
  });

  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-100 overflow-hidden font-sans">
      {/* 1. ПАНЕЛЬ СЕРВЕРОВ */}
      <ServerSidebar />

      {/* 2. ПАНЕЛЬ КАНАЛОВ */}
      <NavigationSidebar
        setActiveChat={setActiveChat}
        activeChat={activeChat}
        isLoading={isLoading}
        conversations={conversations}
      />

      {/* 3. ЗОНА ЧАТА */}
      <div className="flex flex-1 flex-col bg-[#1e1f24] relative">
        {activeChat === "friends" ? <FriendsScreen /> : <ChatScreen />}
      </div>
    </div>
  );
}

export default MainPage;

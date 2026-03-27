import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sendMessage, getDirectMessages } from "../../../api/friends";
import PlusIcon from "../../../components/Icons/plusIcon";

interface ChatScreenProps {
  activeChat: any;
}

function ChatScreen({ activeChat }: ChatScreenProps) {
  const [messageText, setMessageText] = useState("");
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatName =
    typeof activeChat === "object" ? activeChat.nickname : String(activeChat);
  const targetUserId = typeof activeChat === "object" ? activeChat.id : null;

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ["messages", targetUserId],
    queryFn: () => getDirectMessages(targetUserId!),
    enabled: !!targetUserId,
    refetchInterval: 3000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ text, targetId }: { text: string; targetId: number }) =>
      sendMessage(text, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", targetUserId] });
      setMessageText("");
    },
    onError: (error) => {
      alert("Ошибка при отправке сообщения");
      console.error(error);
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    if (targetUserId) {
      sendMessageMutation.mutate({ text: messageText, targetId: targetUserId });
    }
  };

  const messages = messagesData?.received || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className="h-12 flex items-center px-4 border-b border-gray-800 bg-[#1e1f24]/80 backdrop-blur-md absolute top-0 w-full z-10">
        <span className="text-xl text-gray-500 mr-2">@</span>
        <h2 className="font-bold text-gray-100">{chatName}</h2>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 pt-16 pb-24 flex flex-col">
        <div className="text-center text-gray-500 my-4 text-sm mt-auto">
          Это начало вашей истории сообщений с {chatName}.
        </div>

        {isLoading ? (
          <div className="text-center text-gray-400 py-4">
            Загрузка истории...
          </div>
        ) : messages.length > 0 ? (
          messages.map((msg: any, idx: number) => {
            const timeString = new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const isMe = msg.sender_id !== targetUserId;

            return (
              <div
                key={msg.id}
                className={`flex ${idx === 0 ? "mt-6" : "mt-2"} hover:bg-gray-800/30 p-2 rounded transition-colors -mx-2`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 font-bold shadow-sm ${isMe ? "bg-indigo-500/20 text-indigo-400 shadow-indigo-500/10" : "bg-gray-600/50 text-gray-300"}`}
                >
                  {isMe ? "Вы" : chatName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline mb-0.5">
                    <span
                      className={`font-bold mr-2 cursor-pointer hover:underline ${isMe ? "text-indigo-400" : "text-gray-200"}`}
                    >
                      {isMe ? "Вы" : chatName}
                    </span>
                    <span className="text-xs text-gray-500">
                      Сегодня в {timeString}
                    </span>
                  </div>
                  <p className="text-gray-300 break-words leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-600 mt-4 mb-4">
            Пока нет сообщений
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода сообщения */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-[#1e1f24] min-h-[80px]">
        <form
          onSubmit={handleSendMessage}
          className="bg-gray-800 border border-gray-700/50 rounded-lg flex items-center px-4 py-3 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition shadow-lg w-full"
        >
          <button
            type="button"
            className="text-gray-400 hover:text-indigo-400 transition mr-3 flex-shrink-0"
          >
            <PlusIcon />
          </button>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={sendMessageMutation.isPending}
            placeholder={
              sendMessageMutation.isPending
                ? "Отправка..."
                : `Написать @${chatName}`
            }
            className="bg-transparent text-gray-100 w-full focus:outline-none placeholder-gray-500 font-medium tracking-wide disabled:opacity-50"
          />
        </form>
      </div>
    </>
  );
}

export default ChatScreen;

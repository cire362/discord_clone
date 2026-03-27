import { useState } from "react";
import PlusIcon from "../../../components/Icons/plusIcon";

interface ChatScreenProps {
  activeChat: string;
}

function ChatScreen({ activeChat }: ChatScreenProps) {
  const [messageText, setMessageText] = useState("");

  const [localMessages, setLocalMessages] = useState<
    { id: number; text: string; time: string }[]
  >([]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;

    setLocalMessages([
      ...localMessages,
      {
        id: Date.now(),
        text: messageText,
        time: timeString,
      },
    ]);
    setMessageText("");
  };
  return (
    <>
      <div className="h-12 flex items-center px-4 border-b border-gray-800 bg-[#1e1f24]/80 backdrop-blur-md absolute top-0 w-full z-10">
        <span className="text-xl text-gray-500 mr-2">@</span>
        <h2 className="font-bold text-gray-100">{activeChat}</h2>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 pt-16 pb-24">
        <div className="text-center text-gray-500 my-4 text-sm">
          Это начало вашей истории сообщений с {activeChat}.
        </div>

        {/* Пример сообщений */}
        {localMessages.map((msg, idx) => (
          <div
            key={msg.id}
            className={`flex ${idx === 0 ? "mt-6" : "mt-2"} hover:bg-gray-800/30 p-2 rounded transition-colors -mx-2`}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 font-bold shadow-sm shadow-indigo-500/10">
              JS
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline mb-0.5">
                <span className="font-bold text-indigo-400 mr-2 cursor-pointer hover:underline">
                  Kirill
                </span>
                <span className="text-xs text-gray-500">
                  Сегодня в {msg.time}
                </span>
              </div>
              <p className="text-gray-300 break-words leading-relaxed">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
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
            placeholder={`Написать @${activeChat}`}
            className="bg-transparent text-gray-100 w-full focus:outline-none placeholder-gray-500 font-medium tracking-wide"
          />
        </form>
      </div>
    </>
  );
}

export default ChatScreen;

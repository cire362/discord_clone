interface PendingFriends {
  totalPending: number;
  pendingIncoming: Array<any>;
  pendingOutgoing: Array<any>;
  acceptFriendMutation: {
    mutate: (id: number) => void;
    isPending: boolean;
  };
}

function PendingFriends({
  totalPending,
  pendingIncoming,
  acceptFriendMutation,
  pendingOutgoing,
}: PendingFriends) {
  return (
    <>
      <h3 className="text-gray-400 text-sm uppercase font-bold mb-2 pt-2">
        Ожидающие — {totalPending}
      </h3>
      {totalPending > 0 ? (
        <>
          {/* Входящие заявки */}
          {pendingIncoming.map((req: any) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-3 rounded bg-gray-800 hover:bg-gray-700/50 transition border border-gray-700/50 mb-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white shadow-sm">
                  {req.sender?.nickname
                    ? req.sender.nickname[0].toUpperCase()
                    : "U"}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-100">
                    {req.sender?.nickname}
                  </span>
                  <span className="text-xs text-gray-400">
                    Входящий запрос от @{req.sender?.login}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => acceptFriendMutation.mutate(req.id)}
                  disabled={acceptFriendMutation.isPending}
                  className="w-9 h-9 bg-gray-900 hover:bg-green-600 text-green-500 hover:text-white rounded-full flex items-center justify-center transition shadow-sm"
                  title="Принять"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* Исходящие заявки */}
          {pendingOutgoing.map((req: any) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-3 rounded bg-gray-800 hover:bg-gray-700/50 transition border border-gray-700/50 mb-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center font-bold text-white shadow-sm">
                  {req.receiver?.nickname
                    ? req.receiver.nickname[0].toUpperCase()
                    : "U"}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-100">
                    {req.receiver?.nickname}
                  </span>
                  <span className="text-xs text-gray-400">
                    Исходящий запрос для @{req.receiver?.login}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 text-gray-500 text-sm italic pr-2">
                Ожидает ответа
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="text-center text-gray-500 flex flex-col items-center py-20 mt-10">
          Нет ожидающих заявок в друзья.
        </div>
      )}
    </>
  );
}

export default PendingFriends;

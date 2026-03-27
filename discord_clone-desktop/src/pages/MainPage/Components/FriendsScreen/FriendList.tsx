interface FriendListProps {
  allFriends: any;
  isFriendsLoading: Boolean;
}

function FriendList({ allFriends, isFriendsLoading }: FriendListProps) {
  return (
    <>
      <h3 className="text-gray-400 text-sm uppercase font-bold mb-2 pt-2">
        Все друзья — {allFriends.length}
      </h3>
      {isFriendsLoading ? (
        <div className="text-center text-gray-400 py-4">Загрузка...</div>
      ) : allFriends.length > 0 ? (
        allFriends.map((friend: any) => {
          const user = friend.sender || friend.receiver;
          if (!user) return null;
          return (
            <div
              key={friend.id}
              className="flex items-center justify-between p-3 rounded bg-gray-800 hover:bg-gray-700/50 transition border border-gray-700/50 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white shadow-sm">
                  {user.nickname ? user.nickname[0].toUpperCase() : "U"}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-100">
                    {user.nickname}
                  </span>
                  <span className="text-xs text-gray-400">@{user.login}</span>
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-gray-200 p-2 rounded-full hover:bg-gray-900 transition">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-500 flex flex-col items-center py-20 mt-10">
          <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-16 h-16 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          У вас пока нет друзей.
        </div>
      )}
    </>
  );
}

export default FriendList;

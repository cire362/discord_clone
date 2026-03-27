interface AddFriendProps {
  isSearchLoading: boolean;
  searchFriendText: string;
  addFriendMutation: {
    mutate: (id: number) => void;
    isPending: boolean;
  };
  searchResults: {
    users: Array<any>;
  };
  setSearchFriendText: (value: string) => void;
  debouncedSearch: string;
}

function AddFriend({
  setSearchFriendText,
  searchFriendText,
  debouncedSearch,
  isSearchLoading,
  searchResults,
  addFriendMutation,
}: AddFriendProps) {
  return (
    <>
      <div className="mb-4">
        <h2 className="font-bold text-gray-100 text-md mb-2">
          Добавить в друзья
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Вы можете добавить друга с помощью его юзернейма.
        </p>
        <div className="bg-gray-900 border border-gray-700/50 rounded-lg flex items-center px-4 py-3 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition shadow-sm w-full">
          <input
            type="text"
            value={searchFriendText}
            onChange={(e) => setSearchFriendText(e.target.value)}
            placeholder="Вы можете добавить друга с помощью юзернейма."
            className="bg-transparent text-gray-100 w-full focus:outline-none placeholder-gray-500 text-sm"
          />
        </div>
      </div>

      {debouncedSearch && (
        <>
          <h3 className="text-gray-400 text-sm uppercase font-bold mb-2 pt-2 border-t border-gray-800">
            Результаты поиска
          </h3>
          {isSearchLoading ? (
            <div className="text-center text-gray-400 py-4">Ищем...</div>
          ) : searchResults?.users?.length > 0 ? (
            searchResults.users.map((user: any) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded bg-gray-800 hover:bg-gray-700/50 transition border border-gray-700/50"
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
                <button
                  onClick={() => addFriendMutation.mutate(user.id)}
                  disabled={addFriendMutation.isPending}
                  className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-1.5 rounded text-sm font-semibold transition shadow-sm"
                >
                  {addFriendMutation.isPending ? "Отправка..." : "Добавить"}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-4">
              Пользователи не найдены
            </div>
          )}
        </>
      )}
    </>
  );
}

export default AddFriend;

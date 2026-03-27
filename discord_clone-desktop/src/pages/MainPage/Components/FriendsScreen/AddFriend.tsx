import { UserListItem } from "../../../../components/ui/UserListItem";
import { SectionTitle } from "../../../../components/ui/SectionTitle";
import { Button } from "../../../../components/ui/Button";

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
          <SectionTitle
            title="Результаты поиска"
            className="border-t border-gray-800"
          />
          {isSearchLoading ? (
            <div className="text-center text-gray-400 py-4">Ищем...</div>
          ) : searchResults?.users?.length > 0 ? (
            searchResults.users.map((user: any) => (
              <UserListItem
                key={user.id}
                nickname={user.nickname}
                subtitle={`@${user.login}`}
                rightAction={
                  <Button
                    onClick={() => addFriendMutation.mutate(user.id)}
                    disabled={addFriendMutation.isPending}
                  >
                    {addFriendMutation.isPending ? "Отправка..." : "Добавить"}
                  </Button>
                }
              />
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

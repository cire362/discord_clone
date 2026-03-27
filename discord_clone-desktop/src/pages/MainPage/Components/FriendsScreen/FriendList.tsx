import MessageIcon from "../../../../components/Icons/messageIcon";
import NoFriendsIcon from "../../../../components/Icons/noFriendsIcon";
import { UserListItem } from "../../../../components/ui/UserListItem";
import { SectionTitle } from "../../../../components/ui/SectionTitle";

interface FriendListProps {
  allFriends: any;
  isFriendsLoading: Boolean;
  setActiveChat: (chatId: any) => void;
}

function FriendList({
  allFriends,
  isFriendsLoading,
  setActiveChat,
}: FriendListProps) {
  return (
    <>
      <SectionTitle title="Все друзья" count={allFriends.length} />
      {isFriendsLoading ? (
        <div className="text-center text-gray-400 py-4">Загрузка...</div>
      ) : allFriends.length > 0 ? (
        allFriends.map((friend: any) => {
          const user = friend.sender || friend.receiver;
          if (!user) return null;
          return (
            <UserListItem
              key={friend.id}
              nickname={user.nickname}
              subtitle={`@${user.login}`}
              onClick={() =>
                setActiveChat({ id: user.id, nickname: user.nickname })
              }
              rightAction={
                <div className="text-gray-400 group-hover:text-gray-200 p-2 rounded-full hover:bg-gray-900 transition flex items-center justify-center">
                  <MessageIcon />
                </div>
              }
            />
          );
        })
      ) : (
        <div className="text-center text-gray-500 flex flex-col items-center py-20 mt-10">
          <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <NoFriendsIcon />
          </div>
          У вас пока нет друзей.
        </div>
      )}
    </>
  );
}

export default FriendList;

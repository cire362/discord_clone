import AcceptFriendIcon from "../../../../components/Icons/acceptFriendIcon";
import { UserListItem } from "../../../../components/ui/UserListItem";
import { SectionTitle } from "../../../../components/ui/SectionTitle";
import { Button } from "../../../../components/ui/Button";

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
      <SectionTitle title="Ожидающие" count={totalPending} />
      {totalPending > 0 ? (
        <>
          {/* Входящие заявки */}
          {pendingIncoming.map((req: any) => (
            <UserListItem
              key={req.id}
              nickname={req.sender?.nickname}
              subtitle={`Входящий запрос от @${req.sender?.login}`}
              className="mb-2"
              rightAction={
                <Button
                  variant="icon"
                  onClick={() => acceptFriendMutation.mutate(req.id)}
                  disabled={acceptFriendMutation.isPending}
                  title="Принять"
                >
                  <AcceptFriendIcon />
                </Button>
              }
            />
          ))}

          {/* Исходящие заявки */}
          {pendingOutgoing.map((req: any) => (
            <UserListItem
              key={req.id}
              nickname={req.receiver?.nickname}
              subtitle={`Исходящий запрос для @${req.receiver?.login}`}
              className="mb-2"
              avatarClassName="bg-gray-600"
              rightAction={
                <div className="text-gray-500 text-sm italic pr-2">
                  Ожидает ответа
                </div>
              }
            />
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

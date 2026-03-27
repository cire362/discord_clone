import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  searchUsers,
} from "../../../api/friends";
import FriendIcon from "../../../components/Icons/friendIcon";
import FriendList from "./FriendsScreen/FriendList";
import PendingFriends from "./FriendsScreen/PendingFriends";
import AddFriend from "./FriendsScreen/AddFriend";

interface FriendsScreenProps {
  setActiveChat: (chat: any) => void;
}

function FriendsScreen({ setActiveChat }: FriendsScreenProps) {
  const queryClient = useQueryClient();
  const [friendTab, setFriendTab] = useState<"all" | "pending" | "add">("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchFriendText, setSearchFriendText] = useState("");

  const { data: friendsData, isLoading: isFriendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: () => getFriends(),
  });

  const addFriendMutation = useMutation({
    mutationFn: (userId: number) => sendFriendRequest(userId),
    onSuccess: () => {
      alert("Заявка в друзья отправлена!");
      setSearchFriendText("");
    },
    onError: (error) => {
      alert("Ошибка при добавлении в друзья");
      console.error(error);
    },
  });

  const acceptFriendMutation = useMutation({
    mutationFn: (requestId: number) => acceptFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error) => {
      alert("Ошибка при принятии заявки");
      console.error(error);
    },
  });

  const pendingIncoming =
    friendsData?.friends?.incoming?.filter(
      (f: any) => f.status === "PENDING",
    ) || [];
  const pendingOutgoing =
    friendsData?.friends?.outgoing?.filter(
      (f: any) => f.status === "PENDING",
    ) || [];
  const totalPending = pendingIncoming.length + pendingOutgoing.length;

  const allFriends = [
    ...(friendsData?.friends?.incoming?.filter(
      (f: any) => f.status === "ACCEPTED",
    ) || []),
    ...(friendsData?.friends?.outgoing?.filter(
      (f: any) => f.status === "ACCEPTED",
    ) || []),
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchFriendText);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchFriendText]);

  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ["searchUsers", debouncedSearch],
    queryFn: () => searchUsers(debouncedSearch),
    enabled: debouncedSearch.length > 0 && friendTab === "add",
  });

  return (
    <>
      <div className="h-12 flex items-center px-4 border-b border-gray-800 bg-[#1e1f24]/80 backdrop-blur-md absolute top-0 w-full z-10 gap-6">
        <div className="flex items-center text-gray-100 font-bold gap-2 mr-4 border-r border-gray-700 pr-6">
          <FriendIcon />
          Друзья
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <button
            onClick={() => setFriendTab("all")}
            className={`px-2 py-1 rounded transition-colors ${friendTab === "all" ? "bg-gray-700 text-gray-100" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"}`}
          >
            Все друзья
          </button>
          <button
            onClick={() => setFriendTab("pending")}
            className={`px-2 py-1 rounded transition-colors flex items-center gap-1.5 ${friendTab === "pending" ? "bg-gray-700 text-gray-100" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"}`}
          >
            Ожидающие
            {totalPending > 0 && (
              <span className="bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalPending}
              </span>
            )}
          </button>
          <button
            onClick={() => setFriendTab("add")}
            className={`px-2 py-1 rounded transition-colors ${friendTab === "add" ? "bg-green-600 text-white" : "bg-green-700/20 text-green-500 hover:bg-green-700/30"}`}
          >
            Добавить в друзья
          </button>
        </div>
      </div>

      <div className="absolute top-12 left-0 right-0 bottom-0 overflow-y-auto p-4 flex flex-col gap-2 z-0 mt-4 pb-20">
        {friendTab === "all" && (
          <FriendList
            allFriends={allFriends}
            isFriendsLoading={isFriendsLoading}
            setActiveChat={setActiveChat}
          />
        )}

        {friendTab === "pending" && (
          <PendingFriends
            totalPending={totalPending}
            pendingIncoming={pendingIncoming}
            pendingOutgoing={pendingOutgoing}
            acceptFriendMutation={acceptFriendMutation}
          />
        )}

        {friendTab === "add" && (
          <AddFriend
            isSearchLoading={isSearchLoading}
            searchFriendText={searchFriendText}
            addFriendMutation={addFriendMutation}
            searchResults={searchResults}
            setSearchFriendText={setSearchFriendText}
            debouncedSearch={debouncedSearch}
          />
        )}
      </div>
    </>
  );
}

export default FriendsScreen;

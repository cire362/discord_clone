import { Avatar } from "./Avatar";
import { ReactNode } from "react";

interface UserListItemProps {
  nickname: string;
  subtitle: string;
  avatarClassName?: string;
  rightAction?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function UserListItem({
  nickname,
  subtitle,
  avatarClassName,
  rightAction,
  onClick,
  className = "",
}: UserListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded bg-gray-800 hover:bg-gray-700/50 transition border border-gray-700/50 ${
        onClick ? "cursor-pointer group" : ""
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        <Avatar nickname={nickname} className={avatarClassName} />
        <div className="flex flex-col text-left">
          <span className="font-bold text-gray-100">{nickname}</span>
          <span className="text-xs text-gray-400">{subtitle}</span>
        </div>
      </div>
      {rightAction && (
        <div className="flex gap-2 items-center">{rightAction}</div>
      )}
    </div>
  );
}

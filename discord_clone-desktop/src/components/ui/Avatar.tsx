interface AvatarProps {
  nickname?: string;
  className?: string;
}

export function Avatar({ nickname, className = "bg-indigo-500" }: AvatarProps) {
  const letter = nickname ? nickname[0].toUpperCase() : "U";
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${className}`}
    >
      {letter}
    </div>
  );
}

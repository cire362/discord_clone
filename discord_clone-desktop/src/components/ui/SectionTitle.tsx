interface SectionTitleProps {
  title: string;
  count?: number;
  className?: string;
}

export function SectionTitle({
  title,
  count,
  className = "",
}: SectionTitleProps) {
  return (
    <h3
      className={`text-gray-400 text-sm uppercase font-bold mb-2 pt-2 ${className}`}
    >
      {title} {count !== undefined && `— ${count}`}
    </h3>
  );
}

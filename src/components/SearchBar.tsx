type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="searchWrap">
      <input
        className="searchInput"
        type="text"
        placeholder="Find the command you forgot 5 minutes ago..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
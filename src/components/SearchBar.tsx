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
        placeholder="Search notes, commands, tags..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
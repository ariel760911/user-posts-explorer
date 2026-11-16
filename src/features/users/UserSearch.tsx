interface UserSearchProps {
  value: string
  onChange: (value: string) => void
}

export function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    <div className="user-search">
      <label htmlFor="user-search-input">Search by name</label>
      <input
        id="user-search-input"
        type="search"
        placeholder="e.g. Leanne"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

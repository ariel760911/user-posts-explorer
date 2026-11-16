import { fieldControl } from '../../shared/ui/fieldControl.ts'

interface UserSearchProps {
  value: string
  onChange: (value: string) => void
}

export function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <label htmlFor="user-search-input">Search by name</label>
      <input
        id="user-search-input"
        type="search"
        placeholder="e.g. Leanne"
        autoComplete="off"
        className={fieldControl}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  )
}

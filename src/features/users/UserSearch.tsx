import { fieldControl } from '../../shared/ui/fieldControl.ts'

interface UserSearchProps {
  value: string
  onChange: (value: string) => void
}

export function UserSearch({ value, onChange }: UserSearchProps) {
  return (
    // Sticky on mobile so the search stays reachable while scrolling the list.
    <div className="sticky top-0 z-10 mb-2 flex flex-col gap-1 bg-white py-2 md:static md:mb-4 md:py-0">
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

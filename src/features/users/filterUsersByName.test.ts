import { describe, expect, it } from 'vitest'
import type { User } from '../../api/types.ts'
import { filterUsersByName } from './filterUsersByName.ts'

const users: User[] = [
  { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'a@a.com' },
  { id: 2, name: 'José Pérez', username: 'jp', email: 'b@b.com' },
  { id: 3, name: 'Ervin Howell', username: 'Antonette', email: 'c@c.com' },
]

const ids = (query: string) => filterUsersByName(users, query).map((user) => user.id)

describe('filterUsersByName', () => {
  it('returns every user for an empty or blank query', () => {
    expect(ids('')).toEqual([1, 2, 3])
    expect(ids('   ')).toEqual([1, 2, 3])
  })

  it('matches part of the name ignoring case and surrounding spaces', () => {
    expect(ids('  GRAHAM ')).toEqual([1])
  })

  it('ignores accents in both the query and the name', () => {
    expect(ids('jose')).toEqual([2])
    expect(ids('Pérez')).toEqual([2])
  })

  it('searches by name only, not by username', () => {
    expect(ids('Antonette')).toEqual([])
  })
})

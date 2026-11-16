import type { Post, User } from '../api/types.ts'

export const usersFixture: User[] = [
  { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'Sincere@april.biz' },
  { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'Shanna@melissa.tv' },
  { id: 3, name: 'Clementine Bauch', username: 'Samantha', email: 'Nathan@yesenia.net' },
]

export const postsFixture: Post[] = [
  { id: 1, userId: 1, title: 'First post by Leanne', body: 'Body of the first post.' },
  { id: 2, userId: 1, title: 'Second post by Leanne', body: 'Body of the second post.' },
  { id: 11, userId: 2, title: 'First post by Ervin', body: 'Body of Ervin post.' },
]

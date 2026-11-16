// Domain types: only the fields the app uses from JSONPlaceholder.

export interface User {
  id: number
  name: string
  username: string
  email: string
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

export type NewPost = Omit<Post, 'id'>

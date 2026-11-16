import type { RouteObject } from 'react-router'
import { UserPostsPage } from '../features/posts/UserPostsPage.tsx'
import { NotFound } from '../shared/ui/NotFound.tsx'
import { Layout } from './Layout.tsx'
import { SelectUserPrompt } from './pages/SelectUserPrompt.tsx'

// Exported as plain objects so tests can mount them in a memory router.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <SelectUserPrompt /> },
      { path: 'users/:userId', element: <UserPostsPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]

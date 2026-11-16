import type { RouteObject } from 'react-router'
import { Layout } from './Layout.tsx'
import { NotFound } from './pages/NotFound.tsx'
import { SelectUserPrompt } from './pages/SelectUserPrompt.tsx'

// Exported as plain objects so tests can mount them in a memory router.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <SelectUserPrompt /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]

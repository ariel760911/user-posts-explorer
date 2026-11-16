import { Outlet, useMatch } from 'react-router'
import { UsersPanel } from '../features/users/UsersPanel.tsx'

export function Layout() {
  const isUserSelected = useMatch('/users/:userId') !== null
  const isHome = useMatch('/') !== null
  // Mobile shows one pane at a time: the list on "/", the content elsewhere
  // (user detail or not-found). From md up, both panes are always visible.
  const showContentOnMobile = isUserSelected || !isHome

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6">
      <header className="mb-6 border-b border-line">
        <h1 className="mb-3 text-3xl font-bold">User Posts Explorer</h1>
      </header>
      <div className="grid items-start gap-8 md:grid-cols-[minmax(240px,320px)_1fr]">
        <aside className={showContentOnMobile ? 'hidden md:block' : undefined}>
          <UsersPanel />
        </aside>
        <main className={showContentOnMobile ? undefined : 'hidden md:block'}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

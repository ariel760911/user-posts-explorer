import { Outlet } from 'react-router'
import { UsersPanel } from '../features/users/UsersPanel.tsx'

export function Layout() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6">
      <header className="mb-6 border-b border-line">
        <h1 className="mb-3 text-3xl font-bold">User Posts Explorer</h1>
      </header>
      <div className="grid items-start gap-8 md:grid-cols-[minmax(240px,320px)_1fr]">
        <aside>
          <UsersPanel />
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

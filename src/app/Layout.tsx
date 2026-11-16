import { Outlet } from 'react-router'
import { UsersPanel } from '../features/users/UsersPanel.tsx'

export function Layout() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>User Posts Explorer</h1>
      </header>
      <div className="app__body">
        <aside className="app__sidebar">
          <UsersPanel />
        </aside>
        <main className="app__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

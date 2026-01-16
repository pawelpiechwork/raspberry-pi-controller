import { createBrowserRouter } from 'react-router'
import { App } from './App'
import { LightsPage } from './pages/LightsPage'
import { ActivityHistoryPage } from './pages/ActivityHistoryPage'
import { SettingsPage } from './pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LightsPage />,
      },
      {
        path: 'history',
        element: <ActivityHistoryPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
])

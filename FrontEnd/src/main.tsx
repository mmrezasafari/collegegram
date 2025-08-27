// main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/root.css'
import './styles/globals.css'
import App from './app/App.tsx'

// import AppRoutes from './app/routes.tsx'

createRoot(document.getElementById('root') as HTMLElement).render(<App />)

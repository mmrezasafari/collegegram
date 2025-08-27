import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Auth from '../features/auth/pages/Auth'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProfilePage } from '@/features/profile/pages/profile-page'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App

import { Toaster } from 'sonner'
import { Authenticate } from '../features/auth/pages/AuthPage'
import { AuthLayout } from '../layouts/AuthLayout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthLayout>
        <Authenticate />
      </AuthLayout>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App

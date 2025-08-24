import { Toaster } from 'sonner'
import { Authenticate } from '../features/auth/pages/AuthPage'
import { AuthLayout } from '../layouts/AuthLayout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SidebarProvider } from '@/features/common/components/ui/sidebar'
import { ProfileSidebar } from '@/features/profile/components/profile-sidebar'
import { TopBar } from '@/features/profile/components/top-bar'
import { ProfilePage } from '@/features/profile/pages/profile-page'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <ProfileSidebar />
        <main className="flex-1">
          <TopBar />
          <ProfilePage />
        </main>
      </SidebarProvider>

      {/* <AuthLayout>
        <Authenticate />
        </AuthLayout>
        <Toaster /> */}
    </QueryClientProvider>
  )
}

export default App

import { Authenticate } from '../features/auth/pages/AuthPage'
import { AuthLayout } from '../layouts/AuthLayout'

function App() {
  return (
    <>
      <AuthLayout>
        <Authenticate />
      </AuthLayout>
    </>
  )
}

export default App

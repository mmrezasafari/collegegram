import { Form } from './features/auth/Form'
import { AuthLayout } from './layouts/AuthLayout'

function App() {
  return (
    <>
      <AuthLayout>
        <Form />
      </AuthLayout>
    </>
  )
}

export default App

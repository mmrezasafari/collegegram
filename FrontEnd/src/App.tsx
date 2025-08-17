import { Form } from './features/auth/Form'
import { AuthLayout } from './layouts/AuthLayout'

function App() {
  return (
    <>
      {/* <div dir="rtl"> */}
      <AuthLayout>
        <Form />
      </AuthLayout>
      {/* </div> */}
    </>
  )
}

export default App

// import { LoginForm } from './LoginForm'
// import { RegisterForm } from './RegisterForm'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RegisterForm } from './RegisterForm'
import { LoginForm } from './LoginForm'
import { Checkbox } from '../../components/ui/checkbox'
import { Label } from '../../components/ui/label'

export const Form = () => {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = (event: {
    target: { checked: boolean | (() => boolean) }
  }) => {
    setIsChecked(event.target.checked)
    if (event.target.checked) {
      console.log('Checkbox is checked!')
      // event.target.checked = true
      // You can trigger any other function here
    } else {
      console.log('Checkbox is unchecked!')
    }
  }

  return (
    <div className="w-full h-full md:w-[500px] md:h-2/3 flex flex-col justify-center items-center bg-backgroundLight md:rounded-3xl py-16 max-md:px-6 md:shadow-formShadow">
      <div>
        <Tabs
          defaultValue="register"
          className="w-[400px]  bg-muted rounded-lg"
        >
          <TabsList className="grid grid-cols-2 align-middle">
            <TabsTrigger value="register">ثبت نام</TabsTrigger>
            <TabsTrigger value="login">ورود</TabsTrigger>
          </TabsList>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
          <TabsContent value="login">
            <LoginForm />
            <div className="flex items-center gap-3">
              <Checkbox
                id="terms"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <Label htmlFor="rememberme">مرا به خاطر بسپار</Label>
            </div>
            <div>
              <a className="float-start" color="#EA5A69" href="url">
                فراموشی رمز عبور
              </a>
            </div>
            <div>
              <a className="float-end" color="#EA5A69" href="url">
                ثبت نام در کالج گرام
              </a>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* <RegisterForm /> */}
      {/* <LoginForm /> */}
    </div>
  )
}

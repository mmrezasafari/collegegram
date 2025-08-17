import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RegisterForm } from './RegisterForm'
import { LoginForm } from './LoginForm'
import * as React from 'react'
import { Separator } from '@/components/ui/separator'

export const Form: React.FC = () => {
  return (
    <div className="w-full h-full md:w-[500px] md:h-2/3 flex flex-col justify-center items-center bg-backgroundLight md:rounded-3xl py-16 max-md:px-6 md:shadow-formShadow gap-8">
      <img
        src="src/assets/images/rahnema-college-logo-far 1.png"
        width="100px"
        height="61"
      />
      <Tabs
        defaultValue="register"
        className="h-[510px] d-flex items-center bg-muted rounded-lg gap-12"
      >
        <TabsList className="d-flex justify-baseline w-full">
          <TabsTrigger
            className="text-[20px] rounded-none data-[state=active]:shadow-none text-grey data-[state=active]:text-black"
            value="login"
          >
            ورود
          </TabsTrigger>
          <Separator orientation="vertical" className="bg-black" />
          <TabsTrigger
            className="text-[20px] rounded-none data-[state=active]:shadow-none text-grey data-[state=active]:text-black"
            value="register"
          >
            ثبت نام
          </TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
        <TabsContent value="login">
          <LoginForm />
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-baseline">
              <span className="text-xs">&#10095;</span>
              <a className="text-primary text-sm" href="url">
                فراموشی رمز عبور
              </a>
            </div>
            <div className="flex gap-2 items-baseline">
              <span className="text-xs">&#10095;</span>
              <a className="text-primary text-sm" href="url">
                ثبت نام در کالج گرام
              </a>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

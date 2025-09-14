import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/common/components/ui/tabs'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { Separator } from '@/features/common/components/ui/separator'
import { useState } from 'react'

export const AuthPage = () => {
  const [defaultTab, setDefaultTab] = useState('login')

  return (
    <div className="w-full h-full md:w-[500px] md:h-auto md:max-h-[700px] flex flex-col justify-center items-center bg-backgroundLight md:rounded-3xl py-16 max-md:px-6 md:shadow-formShadow gap-8">
      <img
        src="src/assets/images/rahnema-college-logo.png"
        width="100px"
        height="61"
      />
      <Tabs
        value={defaultTab}
        onValueChange={setDefaultTab}
        className="h-[510px] d-flex items-center bg-muted rounded-lg gap-12"
      >
        <TabsList className="d-flex justify-baseline w-full">
          <TabsTrigger
            className="text-[20px] rounded-none data-[state=active]:shadow-none text-grey data-[state=active]:text-black cursor-pointer"
            value="login"
          >
            ورود
          </TabsTrigger>
          <Separator orientation="vertical" className="bg-black" />
          <TabsTrigger
            className="text-[20px] rounded-none data-[state=active]:shadow-none text-grey data-[state=active]:text-black cursor-pointer"
            value="register"
          >
            ثبت نام
          </TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <RegisterForm onSuccess={() => setDefaultTab('login')} />
        </TabsContent>
        <TabsContent value="login">
          <LoginForm />
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-baseline">
              <span className="text-xs">&#10095;</span>
              <a
                className="text-primary/80 hover:text-primary text-sm"
                href="url"
              >
                فراموشی رمز عبور
              </a>
            </div>
            <div className="flex gap-2 items-baseline">
              <span className="text-xs">&#10095;</span>
              <TabsList className="p-0">
                <TabsTrigger
                  className="text-primary/80 hover:text-primary p-0 font-medium cursor-pointer !text-sm"
                  value="register"
                >
                  ثبت نام در کالج گرام
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

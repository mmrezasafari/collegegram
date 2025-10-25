import { Input } from '@/features/common/components/ui/input'
import { useState } from 'react'

export function ForgetPassword() {
  const [email, setEmail] = useState('')

  return (
    <div className="w-full center flex flex-col gap-8">
      <h3 className="text text-justify">
        <div>
          <h3 className="text-xl text-justify">فراموشی رمز عبور</h3>
          <Input
            name={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="ایمیل خود را وارد کنید"
            className="pr-9"
            // onChange={userNameOrEmail.onChange}
            // value={userNameOrEmail.value}
            // aria-invalid={userNameOrEmail.error ? true : false}
          />
          <button onClick={() => console.log('ارسال لینک بازیابی به', email)}>
            ارسال لینک بازیابی
          </button>
        </div>
      </h3>
    </div>
  )
}

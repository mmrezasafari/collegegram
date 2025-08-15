import type { ReactNode } from "react"

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-full md:bg-[url(../assets/images/authLayout-bg.jpg)] md:bg-clip-border md:bg-cover md:bg-center">
      <div className="h-full backdrop-blur-[2px]">
        {children}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'

export const UserNotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center gap-4">
    <h1 className="text-2xl font-bold text-destructive">کاربر یافت نشد</h1>
    <p className="text-muted-foreground">
      ممکن است نام کاربری اشتباه باشد یا کاربر حذف شده باشد.
    </p>
    <Link to="/profile" className="text-primary underline">
      بازگشت به صفحه اصلی
    </Link>
  </div>
)

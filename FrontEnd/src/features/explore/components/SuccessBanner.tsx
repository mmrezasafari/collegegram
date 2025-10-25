import { CheckCircle2 } from 'lucide-react'

const SuccessBanner = () => (
  <div
    style={{
      background: '#CFFFE0',
      borderRadius: '9999px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem 2rem',
      gap: '1rem',
      width: 'fit-content',
      margin: '0 auto',
      fontFamily: 'inherit',
    }}
  >
    <span style={{ color: '#134D39', fontSize: '1rem' }}>
      با موفقیت وارد شدید
    </span>
    <CheckCircle2 size={28} color="#134D39" />
  </div>
)

export default SuccessBanner

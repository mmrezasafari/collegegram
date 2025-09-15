import { PanelsTopLeft, Plus, Search } from 'lucide-react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { DialogAndModalWizard } from './DialogAndModalWizard'
import { UploadPostForm } from '@/features/post/components/UploadPostForm'

export const FixedMenu = () => {
  const [uploadPostWizardOpen, setUploadPostWizardOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[80%] bg-white rounded-full shadow-lg flex items-center justify-between px-12 py-3 border border-gray-400">
        {/* Left Icon */}
        <Link to="search">
          <Search className="w-6 h-6" />
        </Link>

        {/* Floating Action Button */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <Button
            className="bg-rose-500 min-w-0 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center !p-0"
            onClick={() => setUploadPostWizardOpen(true)}
          >
            <Plus />
          </Button>
        </div>

        {/* Right Icon */}
        <Link to="explore">
          <PanelsTopLeft />
        </Link>
      </div>
      {uploadPostWizardOpen && (
        <DialogAndModalWizard
          open={uploadPostWizardOpen}
          setOpen={setUploadPostWizardOpen}
        >
          <UploadPostForm onSuccess={() => setUploadPostWizardOpen(false)} />
        </DialogAndModalWizard>
      )}
    </>
  )
}

import React from 'react'
import { SignIn } from '@clerk/nextjs'
const Page = () => {
  return (
    <div>
      <SignIn forceRedirectUrl='/dashboard' />
    </div>
  )
}

export default Page

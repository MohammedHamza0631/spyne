import React from 'react'
import CarForm from '@/components/car-form'

export const metadata = {
  title: 'Create Car - Spyne',
  description: 'Add a new car to your collection'
}

const Page = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <CarForm />
    </div>
  )
}

export default Page

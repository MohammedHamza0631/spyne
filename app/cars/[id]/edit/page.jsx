import { db } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import CarForm from '@/components/car-form'

async function getCar (id) {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) notFound();
  
    // Get the database user
    const user = await db.user.findUnique({
      where: { clerkUserId }
    });
  
    if (!user) notFound();

  const car = await db.car.findUnique({
    where: { id },
    include: { user: true }
  })
    
  if (!car || user.id !== car.userId) notFound()

  return car
}

export default async function EditCarPage({ params }) {
    const carParams = await params
  const car = await getCar(carParams.id)

  return (
    <div className='container mx-auto px-4 py-8'>
      <CarForm initialData={car} />
    </div>
  )
}

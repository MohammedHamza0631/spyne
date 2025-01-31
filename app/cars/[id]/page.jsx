import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CarDetail from '@/components/car-detail'

async function getCar (id) {
  const { userId } = await auth()

  const car = await db.car.findUnique({
    where: { id },
    include: { user: true }
  })

  if (!car) notFound()

  return {
    ...car,
    isOwner: car.user.id === car.userId
  }
}

export default async function CarPage ({ params }) {
  const carParams = await params
  const car = await getCar(carParams.id)

  return <CarDetail initialCar={car} />
}

// import { auth } from '@clerk/nextjs/server'
// import { db } from '@/lib/prisma'
// import Link from 'next/link'
// import { notFound } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Pencil, Trash2 } from 'lucide-react'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger
// } from '@/components/ui/alert-dialog'

// async function getCar (id) {
//   const { userId } = await auth()
//     console.log(userId)
//   const car = await db.car.findUnique({
//     where: { id },
//     include: { user: true }
//   })

//     if (!car) notFound()

//     console.log(car)
//     // userId: user_2sJ2xdeasz6hUBjIqZ9iFHqbvYY
//     // car?.user?.id

//     // Check if the current user is the owner of the car
//     const isOwner = car?.user?.id === car?.userId
//     console.log(isOwner)

//     return { ...car, isOwner }
// }

// async function deleteCar (carId) {
//   'use server'

//   const { userId } = await auth()
//   const car = await db.car.findUnique({
//     where: { id: carId }
//   })

//   if (!car || car.userId !== userId) {
//     throw new Error('Unauthorized')
//   }

//   await db.car.delete({
//     where: { id: carId }
//   })

//   revalidatePath('/dashboard')
// }

// export default async function CarPage({ params }) {
//     const carParams = await params
//   const car = await getCar(carParams.id)

//   return (
//     <div className='container mx-auto px-4 py-8'>
//       <div className='max-w-4xl mx-auto'>
//         {/* Image Gallery */}
//         <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
//           {car.images.map((image, index) => (
//             <div
//               key={index}
//               className={`relative ${
//                 index === 0 ? 'col-span-2 row-span-2' : ''
//               }`}
//             >
//               <img
//                 src={image}
//                 alt={`${car.title} - Image ${index + 1}`}
//                 className='w-full h-full object-cover rounded-lg'
//               />
//             </div>
//           ))}
//         </div>

//         {/* Car Details */}
//         <div className='space-y-6'>
//           <div className='flex justify-between items-start'>
//             <div>
//               <h1 className='text-3xl font-bold'>{car.title}</h1>
//               <p className='text-muted-foreground'>
//                 Listed by {car.user.name} ·{' '}
//                 {new Date(car.createdAt).toLocaleDateString()}
//               </p>
//             </div>

//             {car.isOwner && (
//               <div className='flex gap-2'>
//                 <Button variant='outline' asChild>
//                   <Link href={`/cars/${car.id}/edit`}>
//                     <Pencil className='w-4 h-4 mr-2' />
//                     Edit
//                   </Link>
//                 </Button>

//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <Button variant='destructive'>
//                       <Trash2 className='w-4 h-4 mr-2' />
//                       Delete
//                     </Button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         This action cannot be undone. This will permanently
//                         delete your car listing and remove the data from our
//                         servers.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Cancel</AlertDialogCancel>
//                       <AlertDialogAction
//                         onClick={() => deleteCar(car.id)}
//                         className='bg-destructive text-destructive-foreground'
//                       >
//                         Delete
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               </div>
//             )}
//           </div>

//           <div className='prose max-w-none'>
//             <div className='grid grid-cols-2 gap-4 mb-6'>
//               <div>
//                 <h3 className='text-lg font-semibold'>Car Details</h3>
//                 <dl className='space-y-1'>
//                   <div className='flex justify-between'>
//                     <dt className='text-muted-foreground'>Type:</dt>
//                     <dd>{car.carType}</dd>
//                   </div>
//                   <div className='flex justify-between'>
//                     <dt className='text-muted-foreground'>Company:</dt>
//                     <dd>{car.company}</dd>
//                   </div>
//                   <div className='flex justify-between'>
//                     <dt className='text-muted-foreground'>Dealer:</dt>
//                     <dd>{car.dealer}</dd>
//                   </div>
//                 </dl>
//               </div>
//             </div>

//             <h3 className='text-lg font-semibold'>Description</h3>
//             <p className='whitespace-pre-wrap'>{car.description}</p>

//             <div className='mt-6'>
//               <h3 className='text-lg font-semibold mb-2'>Tags</h3>
//               <div className='flex gap-2 flex-wrap'>
//                 {car.tags.map(tag => (
//                   <span
//                     key={tag}
//                     className='px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm'
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
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

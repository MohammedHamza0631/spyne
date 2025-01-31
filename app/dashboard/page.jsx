'use client' // ✅ Required for frontend API fetching

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusCircle, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

function debounce (func, delay) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}

function SearchForm ({ searchQuery, setSearchQuery }) {
  return (
    <form
      className='relative w-full max-w-2xl'
      onSubmit={e => e.preventDefault()}
    >
      <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
      <Input
        name='q'
        placeholder='Search cars...'
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className='pl-10'
      />
    </form>
  )
}

function CarGrid ({ cars }) {
  if (!cars?.length) {
    return (
      <Card className='text-center p-12'>
        <CardDescription>
          No cars found. Create your first listing!
        </CardDescription>
        <Button asChild className='mt-4'>
          <Link href='/create'>Create Car Listing</Link>
        </Button>
      </Card>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {cars.map(car => (
        <Card key={car.id} className='overflow-hidden'>
          <div className='aspect-video relative'>
            <Link href={`/cars/${car.id}`}>
              <img
                src={car.images[0]}
                alt={car.title}
                className='object-cover w-full h-full'
              />
            </Link>
          </div>
          <CardHeader>
            <CardTitle className='line-clamp-1'>
              <Link href={`/cars/${car.id}`}>{car.title}</Link>
            </CardTitle>
            <CardDescription className='line-clamp-2'>
              {car.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex gap-2 flex-wrap'>
              {car.tags.map(tag => (
                <span
                  key={tag}
                  className='px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm'
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button variant='outline' asChild>
              <Link href={`/cars/${car.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default function DashboardPage () {
  const [cars, setCars] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  let title = 'All Cars'
  if (router.pathname === '/dashboard') {
    title = 'Your Cars'
  }

  const fetchCars = useCallback(
    debounce(async query => {
      setLoading(true)
      try {
        const res = await fetch(`/api/cars?q=${query}`)
        if (!res.ok) throw new Error('Failed to fetch cars')
        const data = await res.json()
        setCars(data)
      } catch (error) {
        console.error('Error fetching cars:', error)
        setCars([])
      } finally {
        setLoading(false)
      }
    }, 900), 
    []
  )

  useEffect(() => {
    fetchCars(searchQuery)
  }, [searchQuery, fetchCars])

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-8'>
        <h1 className='text-3xl font-bold'>{`${title}`}</h1>
        <div className='flex items-center gap-4 w-full md:w-auto'>
          <SearchForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Button asChild>
            <Link href='/create'>
              <PlusCircle className='mr-2 h-4 w-4' />
              Add Car
            </Link>
          </Button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : <CarGrid cars={cars} />}
    </div>
  )
}

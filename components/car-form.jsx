'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const CarForm = ({ initialData = null }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    carType: initialData?.carType || '',
    company: initialData?.company || '',
    dealer: initialData?.dealer || '',
    tags: initialData?.tags?.join(', ') || '',
    images: initialData?.images || []
  })

  const handleImageUpload = async e => {
    const files = Array.from(e.target.files)
    if (files.length + formData.images.length > 10) {
      setError('Maximum 10 images allowed')
      return
    }

    setLoading(true)
    try {
      const uploadPromises = files.map(async file => {
        const reader = new FileReader()
        return new Promise(resolve => {
          reader.onloadend = async () => {
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ path: reader.result })
            })
            const data = await res.json()
            resolve(data.secure_url)
          }
          reader.readAsDataURL(file)
        })
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }))
    } catch (err) {
      setError('Error uploading images')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
      }

      const url = initialData ? `/api/cars/${initialData.id}` : '/api/cars'
      const method = initialData ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json',
            
         },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Failed to save car')

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const removeImage = index => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Car' : 'Add New Car'}</CardTitle>
        <CardDescription>
          {initialData
            ? 'Update your car details'
            : 'Enter your car details below'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              value={formData.title}
              onChange={e =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='carType'>Car Type</Label>
              <Input
                id='carType'
                value={formData.carType}
                onChange={e =>
                  setFormData(prev => ({ ...prev, carType: e.target.value }))
                }
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='company'>Company</Label>
              <Input
                id='company'
                value={formData.company}
                onChange={e =>
                  setFormData(prev => ({ ...prev, company: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='dealer'>Dealer</Label>
            <Input
              id='dealer'
              value={formData.dealer}
              onChange={e =>
                setFormData(prev => ({ ...prev, dealer: e.target.value }))
              }
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='tags'>Tags (comma-separated)</Label>
            <Input
              id='tags'
              value={formData.tags}
              onChange={e =>
                setFormData(prev => ({ ...prev, tags: e.target.value }))
              }
              placeholder='luxury, sedan, automatic'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='images'>Images ({formData.images.length}/10)</Label>
            <Input
              id='images'
              type='file'
              accept='image/*'
              multiple
              onChange={handleImageUpload}
              disabled={formData.images.length >= 10 || loading}
            />
          </div>

          {formData.images.length > 0 && (
            <div className='grid grid-cols-3 gap-4'>
              {formData.images.map((url, index) => (
                <div key={index} className='relative'>
                  <img
                    src={url}
                    alt={`Car image ${index + 1}`}
                    className='w-full h-32 object-cover rounded'
                  />
                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    className='absolute top-2 right-2'
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button type='submit' disabled={loading} className='w-full'>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {initialData ? 'Update Car' : 'Create Car'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CarForm

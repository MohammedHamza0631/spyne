import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const APIDocumentation = () => {
  const endpoints = [
    {
      id: 'cars-get',
      method: 'GET',
      path: '/api/cars',
      title: 'List All Cars',
      description:
        'Retrieve all cars with optional search functionality. This route is public.',
      authentication: 'Not Required',
      parameters: [
        {
          name: 'q',
          type: 'string',
          in: 'query',
          description:
            'Optional search keyword for filtering cars by title, description, or tags'
        }
      ],
      responses: {
        200: {
          description: 'Array of car objects',
          example: `[{
        id: "uuid",
        title: "string",
        description: "string",
        images: ["string"],
        carType: "string",
        company: "string",
        dealer: "string",
        tags: ["string"],
        userId: "string",
        user: { id: "string", name: "string", email: "string" },
        createdAt: "datetime",
        updatedAt: "datetime"
      }]`
        },
        500: { description: 'Server error' }
      }
    },
    {
      id: 'cars-post',
      method: 'POST',
      path: '/api/cars',
      title: 'Create New Car',
      description: 'Create a new car listing',
      authentication: 'Required',
      requestBody: {
        type: 'application/json',
        content: {
          title: {
            type: 'string',
            description: 'The title/name of the car listing. Required field.'
          },
          description: {
            type: 'string',
            description: 'Detailed description of the car.'
          },
          images: {
            type: 'string[]',
            description:
              'Array of Cloudinary URLs for car images. Maximum 10 images allowed.'
          },
          carType: {
            type: 'string',
            description:
              'Category of the car (e.g., SUV, Sedan, Hatchback, etc.).'
          },
          company: {
            type: 'string',
            description: 'Manufacturing company/brand name of the car.'
          },
          dealer: {
            type: 'string',
            description: 'Name of the dealer or dealership selling the car.'
          },
          tags: {
            type: 'string[]',
            description: 'Array of searchable tags related to the car.'
          }
        }
      },
      responses: {
        201: {
          description:
            'Created car object with all fields including id, userId, and timestamps.'
        },
        401: { description: 'Unauthorized access' },
        403: { description: 'User not found' },
        500: { description: 'Server error' }
      }
    },
    {
      id: 'car-get',
      method: 'GET',
      path: '/api/cars/[id]',
      title: 'Get Single Car',
      description: 'Retrieve details of a specific car. This route is public.',
      authentication: 'Not Required',
      parameters: [
        {
          name: 'id',
          type: 'string',
          in: 'path',
          description: 'Car ID (UUID)'
        }
      ],
      responses: {
        200: {
          description: 'Car object',
          example: `{
        id: "uuid",
        title: "string",
        description: "string",
        images: ["string"],
        carType: "string",
        company: "string",
        dealer: "string",
        tags: ["string"],
        userId: "string",
        user: { id: "string", name: "string", email: "string" },
        createdAt: "datetime",
        updatedAt: "datetime"
      }`
        },
        404: { description: 'Car not found' },
        500: { description: 'Server error' }
      }
    },
    {
      id: 'car-put',
      method: 'PUT',
      path: '/api/cars/[id]',
      title: 'Update Car',
      description:
        'Update an existing car. Only the owner can update their cars.',
      authentication: 'Required',
      parameters: [
        {
          name: 'id',
          type: 'string',
          in: 'path',
          description: 'Car ID (UUID)'
        }
      ],
      requestBody: {
        type: 'application/json',
        content: {
          title: {
            type: 'string',
            description: 'The title/name of the car listing. Required field.'
          },
          description: {
            type: 'string',
            description: 'Detailed description of the car.'
          },
          images: {
            type: 'string[]',
            description:
              'Array of Cloudinary URLs for car images. Maximum 10 images allowed.'
          },
          carType: {
            type: 'string',
            description:
              'Category of the car (e.g., SUV, Sedan, Hatchback, etc.).'
          },
          company: {
            type: 'string',
            description: 'Manufacturing company/brand name of the car.'
          },
          dealer: {
            type: 'string',
            description: 'Name of the dealer or dealership selling the car.'
          },
          tags: {
            type: 'string[]',
            description: 'Array of searchable tags related to the car.'
          }
        }
      },
      responses: {
        200: { description: 'Updated car object' },
        401: { description: 'Unauthorized access' },
        403: { description: 'Unauthorized or car not found' },
        500: { description: 'Server error' }
      }
    },
    {
      id: 'car-delete',
      method: 'DELETE',
      path: '/api/cars/[id]',
      title: 'Delete Car',
      description:
        'Delete an existing car. Only the owner can delete their cars.',
      authentication: 'Required',
      parameters: [
        {
          name: 'id',
          type: 'string',
          in: 'path',
          description: 'Car ID (UUID)'
        }
      ],
      responses: {
        200: {
          description: 'Success message',
          example: '{ "message": "Car deleted" }'
        },
        401: { description: 'Unauthorized access' },
        403: { description: 'Unauthorized or car not found' },
        500: { description: 'Server error' }
      }
    },
    {
      id: 'upload',
      method: 'POST',
      path: '/api/upload',
      title: 'Upload Image',
      description:
        'Upload an image to Cloudinary with automatic resizing to 1000x752.',
      authentication: 'Required',
      requestBody: {
        type: 'application/json',
        content: {
          path: {
            type: 'string',
            description:
              'Local path or URL of the image to be uploaded to Cloudinary.'
          }
        }
      },
      responses: {
        200: {
          description:
            'Cloudinary upload result containing the URL and other image details.',
          example: `{
        asset_id: "string",
        public_id: "string",
        version: "number",
        url: "string",
        secure_url: "string"
      }`
        },
        400: { description: 'Missing image path' },
        500: { description: 'Upload failed' }
      }
    }
  ]

  return (
    <div className='container mx-auto p-6 max-w-4xl'>
      <Card className='mb-8 dark:border-gray-700'>
        <CardHeader>
          <CardTitle className='dark:text-white'>
            Car Management API Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-gray-600 dark:text-gray-300 mb-4'>
            This API enables management of car listings with authentication
            using Clerk. All endpoints require authentication except{' '}
            <span className='px-2 py-1 rounded text-white font-mono text-sm bg-blue-600'>GET</span> routes for all cars and single car details.
          </p>

          <h3 className='font-semibold mb-2 dark:text-white'>Authentication</h3>
          <p className='text-gray-600 dark:text-gray-300 mb-4'>
            Authentication is handled by Clerk. Include the session token in the
            request headers.
          </p>
        </CardContent>
      </Card>

      <div className='space-y-6'>
        {endpoints.map(endpoint => (
          <Card
            key={endpoint.id}
            className='overflow-hidden dark:border-gray-700'
          >
            <CardHeader
              className={`flex flex-row items-center gap-4 ${
                endpoint.method === 'GET'
                  ? 'bg-blue-950/10 dark:bg-blue-950/50'
                  : endpoint.method === 'POST'
                  ? 'bg-green-950/10 dark:bg-green-950/50'
                  : endpoint.method === 'PUT'
                  ? 'bg-yellow-950/10 dark:bg-yellow-950/50'
                  : 'bg-red-950/10 dark:bg-red-950/50'
              }`}
            >
              <span
                className={`px-2 py-1 rounded text-white font-mono text-sm ${
                  endpoint.method === 'GET'
                    ? 'bg-blue-600'
                    : endpoint.method === 'POST'
                    ? 'bg-green-600'
                    : endpoint.method === 'PUT'
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}
              >
                {endpoint.method}
              </span>
              <span className='font-mono dark:text-white'>{endpoint.path}</span>
            </CardHeader>

            <CardContent className='pt-6'>
              <h3 className='font-semibold mb-2 dark:text-white'>
                {endpoint.title}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 mb-4'>
                {endpoint.description}
              </p>

              <Tabs defaultValue='params' className='w-full'>
                <TabsList className='dark:bg-gray-800'>
                  {endpoint.parameters && (
                    <TabsTrigger value='params'>Parameters</TabsTrigger>
                  )}
                  {endpoint.requestBody && (
                    <TabsTrigger value='body'>Request Body</TabsTrigger>
                  )}
                  <TabsTrigger value='responses'>Responses</TabsTrigger>
                </TabsList>

                {endpoint.parameters && (
                  <TabsContent value='params'>
                    <div className='mt-2'>
                      <table className='w-full'>
                        <thead>
                          <tr className='text-left border-b dark:border-gray-700'>
                            <th className='pb-2 dark:text-gray-200'>Name</th>
                            <th className='pb-2 dark:text-gray-200'>Type</th>
                            <th className='pb-2 dark:text-gray-200'>
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map((param, idx) => (
                            <tr
                              key={idx}
                              className='border-b dark:border-gray-700'
                            >
                              <td className='py-2 font-mono text-sm dark:text-gray-300'>
                                {param.name}
                              </td>
                              <td className='py-2 text-sm dark:text-gray-300'>
                                {param.type}
                              </td>
                              <td className='py-2 text-sm dark:text-gray-300'>
                                {param.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                )}

                {endpoint.requestBody && (
                  <TabsContent value='body'>
                    <div className='mt-2'>
                      <p className='text-sm mb-2 dark:text-gray-300'>
                        Content Type: {endpoint.requestBody.type}
                      </p>
                      <div className='font-mono text-sm bg-gray-50 dark:bg-gray-800 p-4 rounded'>
                        {Object.entries(endpoint.requestBody.content).map(
                          ([key, value]) => (
                            <div key={key} className='mb-2 dark:text-gray-300'>
                              <span className='text-blue-600 dark:text-blue-400'>
                                "{key}"
                              </span>
                              :{' '}
                              {
                                <span>
                                  {'{'}
                                  <br />
                                  &nbsp;&nbsp;
                                  <span className='text-purple-600 dark:text-purple-400'>
                                    type
                                  </span>
                                  : "{value.type}",
                                  <br />
                                  &nbsp;&nbsp;
                                  <span className='text-purple-600 dark:text-purple-400'>
                                    description
                                  </span>
                                  : "{value.description}"<br />
                                  {'}'}
                                </span>
                              }
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </TabsContent>
                )}

                <TabsContent value='responses'>
                  <div className='mt-2'>
                    <table className='w-full'>
                      <thead>
                        <tr className='text-left border-b dark:border-gray-700'>
                          <th className='pb-2 dark:text-gray-200'>Code</th>
                          <th className='pb-2 dark:text-gray-200'>
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(endpoint.responses).map(
                          ([code, response]) => (
                            <tr
                              key={code}
                              className='border-b dark:border-gray-700'
                            >
                              <td className='py-2 font-mono text-sm dark:text-gray-300'>
                                {code}
                              </td>
                              <td className='py-2 text-sm dark:text-gray-300'>
                                {response.description}
                                {response.example && (
                                  <pre className='mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded overflow-x-auto'>
                                    <code className='text-sm'>
                                      {response.example}
                                    </code>
                                  </pre>
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default APIDocumentation

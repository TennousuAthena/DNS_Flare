import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const zoneSchema = z.object({
  name: z.string().min(1, "Zone name is required").regex(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.?$/, "Invalid domain name format")
})

type ZoneFormData = z.infer<typeof zoneSchema>

export default function ZoneForm() {
  const navigate = useNavigate()
  const { addZone, zones } = useStore()
  const { register, handleSubmit, formState: { errors } } = useForm<ZoneFormData>({
    resolver: zodResolver(zoneSchema)
  })

  const onSubmit = (data: ZoneFormData) => {
    // Check uniqueness
    if (zones.some(z => z.name === data.name)) {
      alert('Zone already exists')
      return
    }

    addZone({
      name: data.name,
      records: [
        // Add default SOA record
        {
          name: data.name,
          type: 'SOA',
          ttl: 3600,
          data: {
            mname: `ns1.${data.name}`,
            rname: `admin.${data.name}`,
            serial: parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, '')) * 100 + 1,
            refresh: 86400,
            retry: 7200,
            expire: 604800,
            minimum: 300
          }
        },
        // Add default NS records
        {
          name: data.name,
          type: 'NS',
          ttl: 86400,
          data: { dname: `ns1.${data.name}` }
        },
        {
          name: data.name,
          type: 'NS',
          ttl: 86400,
          data: { dname: `ns2.${data.name}` }
        }
      ]
    })
    navigate(`/zones/${data.name}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Create New Zone
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            Zone Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="name"
              {...register('name')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="example.com"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter the domain name for the new zone (e.g., example.com). Default SOA and NS records will be created.
          </p>
        </div>

        <div className="flex justify-end gap-x-3">
          <button
            type="button"
            onClick={() => navigate('/zones')}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Zone
          </button>
        </div>
      </form>
    </div>
  )
}

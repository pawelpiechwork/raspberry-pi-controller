import { http, HttpResponse } from 'msw'
import type { Light } from '../pages/lightsPage/useGetLightsQuery'

const lights: Light[] = [
  { id: '1', name: 'Salon', pin: 17, buttonPin: 27, chip: 'gpiochip0', color: '#FFD700', state: 0 },
  { id: '2', name: 'Kuchnia', pin: 18, buttonPin: 22, chip: 'gpiochip0', color: '#87CEEB', state: 1 },
  { id: '3', name: 'Sypialnia', pin: 23, buttonPin: 24, chip: 'gpiochip0', color: '#98FB98', state: 0 },
  { id: '4', name: 'Łazienka', pin: 25, buttonPin: 8, chip: 'gpiochip0', color: '#DDA0DD', state: 1 },
  { id: '5', name: 'Korytarz', pin: 12, buttonPin: 16, chip: 'gpiochip0', color: '#F0E68C', state: 0 },
]

export const handlers = [
  http.get('http://192.168.1.63:3000/lights', () => {
    return HttpResponse.json(lights)
  }),

  http.get('http://192.168.1.63:3000/health', () => {
    return HttpResponse.json({ status: 'ok', uptime: 12345 })
  }),

  http.put('http://192.168.1.63:3000/lights/:id', async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as { state: 0 | 1 }
    
    const light = lights.find(l => l.id === id)
    if (light) {
      light.state = body.state
      return HttpResponse.json(light)
    }
    
    return new HttpResponse(null, { status: 404 })
  }),

  http.patch('http://192.168.1.63:3000/lights/:id/config', async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as { name?: string; pin?: number; buttonPin?: number; color?: string }
    
    const light = lights.find(l => l.id === id)
    if (light) {
      if (body.name !== undefined) light.name = body.name
      if (body.pin !== undefined) light.pin = body.pin
      if (body.buttonPin !== undefined) light.buttonPin = body.buttonPin
      if (body.color !== undefined) light.color = body.color
      return HttpResponse.json(light)
    }
    
    return new HttpResponse(null, { status: 404 })
  }),
]

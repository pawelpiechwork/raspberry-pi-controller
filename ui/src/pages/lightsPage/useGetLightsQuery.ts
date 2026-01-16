import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'

export type Light = {
  id: string
  name: string
  pin: number
  buttonPin: number
  chip: string
  color: string
  state: 0 | 1
}

export const useGetLightsQuery = () => {
  return useQuery({
      queryKey: ['lights'],
      refetchInterval: 5000,
      refetchIntervalInBackground: false,
      queryFn: async (): Promise<Light[]> => {
          const { data } = await api.get('/lights')
          return data
    },
  })
}

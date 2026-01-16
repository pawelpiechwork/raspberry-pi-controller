import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'

export const useGetHealthQuery = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await api.get('/health')
      return data
    },
  })
}

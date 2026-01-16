import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'

export type ActivityRecord = {
  id: number
  datetime: string
  roomId: string
  roomName: string
  newState: 0 | 1
  source: 'api' | 'button'
}

export const useGetActivityQuery = () => {
  return useQuery({
    queryKey: ['activity'],
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    queryFn: async (): Promise<ActivityRecord[]> => {
      const { data } = await api.get('/activity')
      return data
    },
  })
}

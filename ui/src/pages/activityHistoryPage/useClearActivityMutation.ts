import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/client'

export const useClearActivityMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete('/activity')
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity'] })
    },
  })
}

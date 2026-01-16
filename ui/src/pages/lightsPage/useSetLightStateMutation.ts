import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/client'
import type { Light } from './useGetLightsQuery'

export const useSetLightStateMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (light: Light) => {
      // 0 = ON, 1 = OFF
      const newState: 0 | 1 = light.state === 0 ? 1 : 0
      const { data } = await api.put(`/lights/${light.id}`, { state: newState })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lights'] })
    },
  })
}

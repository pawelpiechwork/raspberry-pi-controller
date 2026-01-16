import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/client'
import type { Light } from '../lightsPage/useGetLightsQuery'

export type LightConfigUpdate = {
  name?: string
  pin?: number
  buttonPin?: number
  color?: string
}

export const useUpdateLightConfigMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, config }: { id: string; config: LightConfigUpdate }): Promise<Light> => {
      const { data } = await api.patch(`/lights/${id}/config`, config)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lights'] })
    },
  })
}

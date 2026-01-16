import { Flex } from 'antd'
import { useGetHealthQuery } from './lightsPage/useGetHealthQuery'
import { useGetLightsQuery } from './lightsPage/useGetLightsQuery'
import { useSetLightStateMutation } from './lightsPage/useSetLightStateMutation'
import { PageHeader } from '../components/PageHeader'
import { ActionBar } from '../components/ActionBar'
import { LightsTable } from './lightsPage/LightsTable'

export function LightsPage() {
  const healthQuery = useGetHealthQuery()
  const lightsQuery = useGetLightsQuery()
  const toggleMutation = useSetLightStateMutation()

  return (
    <Flex vertical gap={24}>
      <PageHeader 
        title="Sterowanie oświetleniem"
        description="Widok ten umożliwia sterowanie diodami LED podłączonymi do Raspberry Pi, które symulują oświetlenie domowe w różnych pomieszczeniach, za pomocą interfejsu webowego."
      />
      <ActionBar healthQuery={healthQuery} lightsQuery={lightsQuery} />
      <LightsTable lightsQuery={lightsQuery} toggleMutation={toggleMutation} />
    </Flex>
  )
}

import { Table, Switch, Space, Typography } from 'antd'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import type { Light } from './useGetLightsQuery'

const { Text } = Typography

type LightsTableProps = {
  lightsQuery: UseQueryResult<Light[], Error>
  toggleMutation: UseMutationResult<unknown, Error, Light, unknown>
}

export function LightsTable({ lightsQuery, toggleMutation }: LightsTableProps) {
  return (
    <Table
      bordered
      size="small"
      loading={lightsQuery.isLoading}
      dataSource={lightsQuery.data}
      rowKey="id"
      pagination={false}
      scroll={{ x: 730 }}
      columns={[
        {
          title: 'Pomieszczenie',
          dataIndex: 'name',
          key: 'name',
          width: 150,
        },
        {
          title: 'Pin',
          dataIndex: 'pin',
          key: 'pin',
          width: 150,
          render: (pin: number, record) => (
            <Text code>{`${record.chip} ${pin}`}</Text>
          ),
        },
        {
          title: 'Pin przycisku',
          dataIndex: 'buttonPin',
          key: 'buttonPin',
          width: 150,
          render: (buttonPin: number, record) => (
            <Text code>{`${record.chip} ${buttonPin}`}</Text>
          ),
        },
        {
          title: 'Stan',
          dataIndex: 'state',
          key: 'state',
          width: 120,
          render: (state: number, record) => (
            <Space>
              <span
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: state === 0 ? record.color : '#d9d9d9',
                }}
              />
              <span>{state === 0 ? 'Włączone' : 'Wyłączone'}</span>
            </Space>
          ),
        },
        {
          title: 'Akcja',
          key: 'action',
          width: 20,
          render: (_, light) => (
            <Switch
              size="small"
              checked={light.state === 0}
              onChange={() => toggleMutation.mutate(light)}
              loading={toggleMutation.isPending}
            />
          ),
        },
      ]}
    />
  )
}
